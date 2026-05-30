import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

const CATEGORY_PAGE_PATHS: Record<string, string> = {
CVE: "/cve/",
演講: "/speech/",
證照: "/certificate/",
"NIST 零信任文件": "/nist-zerotrust/",
	"Cloudflare 入門": "/cloudflare-basic/",
	"Azure AD 入門": "/azuread-basic/",
};

export function getCategoryPageUrl(category: string): string | null {
	const path = CATEGORY_PAGE_PATHS[category.trim()];
	return path ? url(path) : null;
}

export function getArchiveCategoryRedirects(): Record<string, string> {
	return Object.fromEntries(
		Object.entries(CATEGORY_PAGE_PATHS).map(([category, path]) => [
			category,
			url(path),
		]),
	);
}

export function getArchiveRedirectUrl(search: string): string | null {
	const params = new URLSearchParams(search);
	if (params.has("tag") || params.has("uncategorized")) {
		return null;
	}

	const categories = params.getAll("category");
	if (categories.length !== 1) {
		return null;
	}

	return getCategoryPageUrl(categories[0] ?? "");
}

export function getPostUrlBySlug(slug: string): string {
	return url(`/posts/${slug}/`);
}

export function getTagUrl(tag: string): string {
	if (!tag) return url("/archive/");
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url("/archive/?uncategorized=true");

	const trimmed = category.trim();
	const categoryPageUrl = getCategoryPageUrl(trimmed);
	if (categoryPageUrl) {
		return categoryPageUrl;
	}

	return url(`/archive/?category=${encodeURIComponent(trimmed)}`);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
