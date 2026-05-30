import type { PostForList } from "./content-utils";

export type ArchivePost = PostForList;

export type ArchiveGroup = {
	year: number;
	posts: ArchivePost[];
};

export type ArchiveFilter = {
	tags?: string[];
	categories?: string[];
	uncategorized?: boolean;
};

export function parsePublishedDate(date: Date | string): Date {
	if (date instanceof Date) {
		return date;
	}
	if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return new Date(`${date}T00:00:00.000Z`);
	}
	return new Date(date);
}

export function formatArchiveDate(date: Date | string): string {
	const value = parsePublishedDate(date);
	const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
	const day = value.getUTCDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

export function getPublishedYear(date: Date | string): number {
	return parsePublishedDate(date).getUTCFullYear();
}

export function formatArchiveTags(tagList: string[]): string {
	return tagList.map((t) => `#${t}`).join(" ");
}

export function filterArchivePosts(
	posts: ArchivePost[],
	filter: ArchiveFilter,
): ArchivePost[] {
	let filtered = posts;

	if (filter.tags && filter.tags.length > 0) {
		filtered = filtered.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => filter.tags!.includes(tag)),
		);
	}

	if (filter.categories && filter.categories.length > 0) {
		filtered = filtered.filter(
			(post) =>
				post.data.category &&
				filter.categories!.includes(post.data.category),
		);
	}

	if (filter.uncategorized) {
		filtered = filtered.filter((post) => !post.data.category);
	}

	return filtered;
}

export function groupPostsByYear(posts: ArchivePost[]): ArchiveGroup[] {
	const grouped = posts.reduce(
		(acc, post) => {
			const year = getPublishedYear(post.data.published);
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, ArchivePost[]>,
	);

	return Object.keys(grouped)
		.map((yearStr) => ({
			year: Number.parseInt(yearStr, 10),
			posts: grouped[Number.parseInt(yearStr, 10)],
		}))
		.sort((a, b) => b.year - a.year);
}
