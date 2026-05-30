import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const EXPORT_DIR = path.resolve(
	"medium-export-69333ab6c92440e422b819172ade1b6bee0d91a3313bd9a4799960f8f8909088/posts",
);
const OUTPUT_DIR = path.resolve("src/content/posts");

const turndown = new TurndownService({
	headingStyle: "atx",
	codeBlockStyle: "fenced",
	emDelimiter: "*",
});
turndown.use(gfm);
turndown.addRule("removeEmptyParagraphs", {
	filter(node) {
		return (
			node.nodeName === "P" &&
			!node.querySelector?.("img") &&
			!node.textContent?.replace(/\u00a0/g, " ").trim()
		);
	},
	replacement() {
		return "";
	},
});

function escapeYaml(value) {
	return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function slugifyFilename(filename) {
	const match = filename.match(
		/^(\d{4}-\d{2}-\d{2})_.+-([a-f0-9]+)\.html$/i,
	);
	if (match) {
		return `${match[1]}-${match[2]}`;
	}
	return path.basename(filename, ".html").replace(/[^a-zA-Z0-9-]+/g, "-");
}

function normalizeWhitespace(text) {
	return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function extractCodeText($, element) {
	const $el = $(element);
	const html = $el.find(".pre--content").html() ?? $el.html() ?? "";
	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/?span[^>]*>/gi, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function prepareBodyHtml($, title) {
	const $body = $("section[data-field=body]").clone();

	$body.find("figure").each((_, figure) => {
		const $figure = $(figure);
		const $img = $figure.find("img").first();
		const caption = normalizeWhitespace(
			$figure.find("figcaption.imageCaption").text(),
		);
		if (!$img.length) {
			$figure.remove();
			return;
		}
		const src = $img.attr("src") ?? "";
		const alt = caption || $img.attr("alt") || "";
		let replacement = `<p><img src="${src}" alt="${alt.replace(/"/g, "&quot;")}"></p>`;
		if (caption) {
			replacement += `<p><em>${caption}</em></p>`;
		}
		$figure.replaceWith(replacement);
	});

	$body.find("pre[data-code-block-lang]").each((_, pre) => {
		const $pre = $(pre);
		const lang = $pre.attr("data-code-block-lang") || "";
		const code = extractCodeText($, pre);
		$pre.replaceWith(
			`<pre><code class="language-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`,
		);
	});

	$body.find("h3.graf--title").first().remove();

	const firstHeading = $body.find("h3").first();
	if (
		firstHeading.length &&
		normalizeWhitespace(firstHeading.text()) === normalizeWhitespace(title)
	) {
		firstHeading.remove();
	}

	return $body.html() ?? "";
}

function extractFeaturedImage($) {
	const featured = $(
		'section[data-field=body] img[data-is-featured="true"]',
	).first();
	if (featured.length) {
		return featured.attr("src") ?? "";
	}
	const first = $("section[data-field=body] img").first();
	return first.attr("src") ?? "";
}

function parseMediumPost(filePath) {
	const html = fs.readFileSync(filePath, "utf8");
	const $ = cheerio.load(html);

	const title =
		normalizeWhitespace($("title").first().text()) ||
		normalizeWhitespace($("h1.p-name").first().text());
	if (!title) {
		return null;
	}

	const publishedFromMeta = $("time.dt-published").attr("datetime");
	const publishedFromName = path.basename(filePath).slice(0, 10);
	const published = (publishedFromMeta ?? publishedFromName).slice(0, 10);

	const description =
		normalizeWhitespace($("section[data-field=subtitle]").text()) ||
		normalizeWhitespace($("section[data-field=description]").text()) ||
		normalizeWhitespace($("section[data-field=body] p").first().text()).slice(
			0,
			160,
		);

	const bodyHtml = prepareBodyHtml($, title);
	let markdown = turndown.turndown(bodyHtml).trim();
	markdown = markdown.replace(/\n{3,}/g, "\n\n");

	const image = extractFeaturedImage($);

	return {
		title,
		published,
		description,
		image,
		markdown,
		slug: slugifyFilename(path.basename(filePath)),
	};
}

function buildFrontmatter({ title, published, description, image }) {
	const lines = [
		"---",
		`title: ${escapeYaml(title)}`,
		`published: ${published}`,
		`description: ${escapeYaml(description)}`,
	];
	if (image) {
		lines.push(`image: ${escapeYaml(image)}`);
	}
	lines.push("tags: []", "draft: false", "---", "");
	return lines.join("\n");
}

function main() {
	if (!fs.existsSync(EXPORT_DIR)) {
		console.error(`Export directory not found: ${EXPORT_DIR}`);
		process.exit(1);
	}

	fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	const files = fs
		.readdirSync(EXPORT_DIR)
		.filter(
			(name) =>
				name.endsWith(".html") &&
				!name.startsWith("draft") &&
				/^\d{4}-\d{2}-\d{2}_/.test(name),
		)
		.sort();

	let imported = 0;
	let skipped = 0;

	for (const file of files) {
		const parsed = parseMediumPost(path.join(EXPORT_DIR, file));
		if (!parsed || !parsed.markdown) {
			skipped++;
			console.warn(`Skipped (empty): ${file}`);
			continue;
		}

		const outputPath = path.join(OUTPUT_DIR, `${parsed.slug}.md`);
		const content =
			buildFrontmatter(parsed) + parsed.markdown + (parsed.markdown ? "\n" : "");
		fs.writeFileSync(outputPath, content, "utf8");
		imported++;
	}

	console.log(`Imported ${imported} posts to ${OUTPUT_DIR}`);
	if (skipped) {
		console.log(`Skipped ${skipped} posts`);
	}
}

main();
