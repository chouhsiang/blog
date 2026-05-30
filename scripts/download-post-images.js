import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.resolve("src/content/posts");
const IMAGES_DIR = path.resolve("public/images/medium");
const CONCURRENCY = 8;

function walkMarkdownFiles(dir) {
	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walkMarkdownFiles(fullPath));
		} else if (entry.name.endsWith(".md")) {
			files.push(fullPath);
		}
	}
	return files;
}

function extractImageUrls(content) {
	const urls = new Set();

	for (const match of content.matchAll(
		/^image:\s*"(https?:\/\/[^"]+)"/gm,
	)) {
		urls.add(match[1]);
	}

	for (const match of content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)) {
		urls.add(match[1]);
	}

	return urls;
}

function hashUrl(url) {
	return crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function extensionFromUrl(url, contentType) {
	const pathname = new URL(url).pathname.toLowerCase();
	const match = pathname.match(/\.(png|jpe?g|gif|webp|svg)$/);
	if (match) {
		return match[1] === "jpeg" ? "jpg" : match[1];
	}
	if (contentType?.includes("png")) return "png";
	if (contentType?.includes("jpeg")) return "jpg";
	if (contentType?.includes("gif")) return "gif";
	if (contentType?.includes("webp")) return "webp";
	if (contentType?.includes("svg")) return "svg";
	return "png";
}

function toMiroUrl(url) {
	const match = url.match(
		/^https:\/\/cdn-images-1\.medium\.com\/max\/\d+\/(.+)$/,
	);
	if (!match) {
		return null;
	}
	return `https://miro.medium.com/v2/resize:fit:800/${match[1]}`;
}

function localPathForUrl(url) {
	const hash = hashUrl(url);
	const existing = fs
		.readdirSync(IMAGES_DIR)
		.find((name) => name.startsWith(`${hash}.`));
	return existing ? `/images/medium/${existing}` : null;
}

async function fetchImage(url) {
	const response = await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
			Referer: "https://medium.com/",
		},
	});
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`);
	}
	return response;
}

async function downloadImage(url) {
	const cached = localPathForUrl(url);
	if (cached) {
		return cached;
	}

	const candidates = [url, toMiroUrl(url)].filter(Boolean);
	let lastError = null;

	for (const candidate of candidates) {
		try {
			const response = await fetchImage(candidate);
			const buffer = Buffer.from(await response.arrayBuffer());
			const ext = extensionFromUrl(url, response.headers.get("content-type"));
			const filename = `${hashUrl(url)}.${ext}`;
			fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
			return `/images/medium/${filename}`;
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError ?? new Error("Download failed");
}

async function mapWithConcurrency(items, limit, worker) {
	const results = new Map();
	let index = 0;

	async function runWorker() {
		while (index < items.length) {
			const current = items[index++];
			try {
				results.set(current, await worker(current));
			} catch (error) {
				console.warn(`Failed: ${current}\n  ${error.message}`);
			}
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, runWorker),
	);
	return results;
}

function replaceUrls(content, urlMap) {
	let updated = content;
	for (const [remote, local] of urlMap) {
		updated = updated.split(remote).join(local);
	}
	return updated;
}

async function main() {
	fs.mkdirSync(IMAGES_DIR, { recursive: true });

	const markdownFiles = walkMarkdownFiles(POSTS_DIR);
	const allUrls = new Set();

	for (const file of markdownFiles) {
		const content = fs.readFileSync(file, "utf8");
		for (const url of extractImageUrls(content)) {
			if (url.startsWith("http")) {
				allUrls.add(url);
			}
		}
	}

	const pendingUrls = [...allUrls].filter((url) => !localPathForUrl(url));
	console.log(`Found ${allUrls.size} image URLs, ${pendingUrls.length} pending`);

	if (pendingUrls.length === 0) {
		console.log("All images already downloaded.");
		return;
	}

	const urlMap = await mapWithConcurrency(
		pendingUrls,
		CONCURRENCY,
		downloadImage,
	);
	console.log(`Downloaded ${urlMap.size} images to ${IMAGES_DIR}`);

	let updatedFiles = 0;
	for (const file of markdownFiles) {
		const content = fs.readFileSync(file, "utf8");
		const updated = replaceUrls(content, urlMap);
		if (updated !== content) {
			fs.writeFileSync(file, updated, "utf8");
			updatedFiles++;
		}
	}

	console.log(`Updated ${updatedFiles} markdown files`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
