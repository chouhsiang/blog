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

export function formatArchiveDateWithYear(date: Date | string): string {
	const value = parsePublishedDate(date);
	const year = value.getUTCFullYear();
	const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
	const day = value.getUTCDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
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

export type ArchiveSortOrder = "desc" | "asc";
export type ArchiveSortBy = "date" | "title";

function getTitleSortKey(title: string): number | null {
	const match = title.match(/^#(\d+)|^\[Day(\d+)\]/);
	if (match) {
		return Number.parseInt(match[1] ?? match[2], 10);
	}

	const nistPatterns = [
		/800[–-]207/,
		/800[–-]63[–-]3/,
		/800[–-]63A/i,
		/800[–-]63B/i,
		/800[–-]63C/i,
	];
	const nistIndex = nistPatterns.findIndex((pattern) => pattern.test(title));
	if (nistIndex >= 0) {
		return 1000 + nistIndex;
	}

	return null;
}

export function sortArchivePostsByTitle(
	posts: ArchivePost[],
	order: ArchiveSortOrder = "asc",
): ArchivePost[] {
	return [...posts].sort((a, b) => {
		const numA = a.data.seriesOrder ?? getTitleSortKey(a.data.title);
		const numB = b.data.seriesOrder ?? getTitleSortKey(b.data.title);

		if (numA !== null && numB !== null) {
			return order === "asc" ? numA - numB : numB - numA;
		}

		const cmp = a.data.title.localeCompare(b.data.title, "zh-TW");
		return order === "asc" ? cmp : -cmp;
	});
}

export function sortArchivePosts(
	posts: ArchivePost[],
	order: ArchiveSortOrder = "desc",
): ArchivePost[] {
	return [...posts].sort((a, b) => {
		const dateA = parsePublishedDate(a.data.published).getTime();
		const dateB = parsePublishedDate(b.data.published).getTime();
		return order === "desc" ? dateB - dateA : dateA - dateB;
	});
}

export function groupPostsByYear(
	posts: ArchivePost[],
	order: ArchiveSortOrder = "desc",
): ArchiveGroup[] {
	const sorted = sortArchivePosts(posts, order);

	const grouped = sorted.reduce(
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
		.sort((a, b) => (order === "desc" ? b.year - a.year : a.year - b.year));
}
