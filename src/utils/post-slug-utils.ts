/** URL slug: filename only, without series subfolder prefix. */
export function normalizePostSlug(slug: string): string {
	const idx = slug.lastIndexOf("/");
	return idx === -1 ? slug : slug.slice(idx + 1);
}
