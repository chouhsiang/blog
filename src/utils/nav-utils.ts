import { LinkPresets } from "../constants/link-presets";
import { LinkPreset, type NavBarLink } from "../types/config";

export type ResolvedNavBarLink = {
	name: string;
	url?: string;
	external?: boolean;
	children?: ResolvedNavBarLink[];
};

export function resolveNavBarLinks(
	items: (NavBarLink | LinkPreset)[],
): ResolvedNavBarLink[] {
	return items.map(resolveNavBarLink);
}

export function resolveNavBarLink(
	item: NavBarLink | LinkPreset,
): ResolvedNavBarLink {
	if (typeof item === "number") {
		return LinkPresets[item];
	}

	if (item.children?.length) {
		return {
			name: item.name,
			external: item.external,
			url: item.url,
			children: item.children.map(resolveNavBarLink),
		};
	}

	return item;
}

export function isNavLinkActive(
	link: ResolvedNavBarLink,
	currentPath: string,
): boolean {
	if (link.url && pathsMatch(link.url, currentPath)) {
		return true;
	}

	return (
		link.children?.some((child) => isNavLinkActive(child, currentPath)) ??
		false
	);
}

function pathsMatch(linkUrl: string, currentPath: string): boolean {
	const normalizedLink = linkUrl.replace(/\/$/, "") || "/";
	const normalizedPath = currentPath.replace(/\/$/, "") || "/";
	return (
		normalizedPath === normalizedLink ||
		normalizedPath.startsWith(`${normalizedLink}/`)
	);
}
