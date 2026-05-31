<script lang="ts">
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import Icon from "@iconify/svelte";
import {
	formatArchiveDate,
	formatArchiveDateWithYear,
	formatArchiveTags,
	groupPostsByYear,
	sortArchivePostsByTitle,
	type ArchivePost,
	type ArchiveSortBy,
	type ArchiveSortOrder,
} from "@utils/archive-utils";
import { getPostUrlBySlug } from "../utils/url-utils";

interface Props {
	posts?: ArchivePost[];
	showTags?: boolean;
	heading?: string;
	intro?: string;
	defaultSortOrder?: ArchiveSortOrder;
	sortBy?: ArchiveSortBy;
}

let {
	posts = [],
	showTags = true,
	heading = "",
	intro = "",
	defaultSortOrder = "desc",
	sortBy = "date",
}: Props = $props();

let sortOrder = $state<ArchiveSortOrder>(defaultSortOrder);

const groups = $derived(
	sortBy === "date" ? groupPostsByYear(posts, sortOrder) : [],
);
const titleSortedPosts = $derived(
	sortBy === "title" ? sortArchivePostsByTitle(posts, sortOrder) : [],
);

function toggleTitleSortOrder() {
	sortOrder = sortOrder === "asc" ? "desc" : "asc";
}

function toggleDateSortOrder() {
	sortOrder = sortOrder === "desc" ? "asc" : "desc";
}
</script>

<div class="card-base px-8 py-6">
	<div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
		{#if heading}
			<h1
				class="font-bold text-3xl text-90 relative ml-3
        before:w-1 before:h-5 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:-left-3 before:top-[0.4rem]"
			>
				{heading}
			</h1>
		{/if}

		{#if sortBy === "date"}
			<button
				type="button"
				aria-label={sortOrder === "desc"
					? i18n(I18nKey.sortNewestFirst)
					: i18n(I18nKey.sortOldestFirst)}
				class="btn-plain scale-animation rounded-lg h-9 px-3 text-sm font-medium active:scale-95 current-theme-btn self-start sm:self-auto"
				onclick={toggleDateSortOrder}
			>
				<span class="flex items-center gap-1.5">
					<Icon
						icon={sortOrder === "desc"
							? "material-symbols:arrow-downward-rounded"
							: "material-symbols:arrow-upward-rounded"}
						class="text-[1.125rem]"
					/>
					{i18n(I18nKey.sortByTime)}
				</span>
			</button>
		{:else if sortBy === "title"}
			<button
				type="button"
				aria-label={sortOrder === "asc"
					? i18n(I18nKey.sortAscending)
					: i18n(I18nKey.sortDescending)}
				class="btn-plain scale-animation rounded-lg h-9 px-3 text-sm font-medium active:scale-95 current-theme-btn self-start sm:self-auto"
				onclick={toggleTitleSortOrder}
			>
				<span class="flex items-center gap-1.5">
					<Icon
						icon={sortOrder === "asc"
							? "material-symbols:arrow-upward-rounded"
							: "material-symbols:arrow-downward-rounded"}
						class="text-[1.125rem]"
					/>
					{i18n(I18nKey.sortByTitle)}
				</span>
			</button>
		{/if}
	</div>

	{#if intro}
		<p class="text-75 text-[0.9375rem] leading-relaxed mb-6 ml-3">
			{intro}
		</p>
	{/if}

	{#if sortBy === "title"}
		<div class="flex flex-row w-full items-center h-[3.75rem]">
			<div class="w-[28%] md:w-[18%]"></div>
			<div class="w-[8%] md:w-[6%]">
				<div
					class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
				></div>
			</div>
			<div class="w-[64%] md:w-[76%] transition text-left text-50">
				{titleSortedPosts.length}
				{i18n(titleSortedPosts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
			</div>
		</div>

		{#each titleSortedPosts as post (post.slug)}
			<a
				href={getPostUrlBySlug(post.slug)}
				aria-label={post.data.title}
				class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
			>
				<div class="flex flex-row justify-start items-center h-full">
					<div
						class="w-[28%] md:w-[18%] transition text-sm text-right text-50 whitespace-nowrap pr-2"
					>
						{formatArchiveDateWithYear(post.data.published)}
					</div>

					<div class="w-[8%] md:w-[6%] relative dash-line h-full flex items-center">
						<div
							class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0_0)] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
						></div>
					</div>

					<div
						class="w-[64%] md:w-[76%] text-left font-bold group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)] text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
					>
						{post.data.title}
					</div>
				</div>
			</a>
		{/each}
	{:else}
		{#each groups as group (group.year)}
		<div>
			<div class="flex flex-row w-full items-center h-[3.75rem]">
				<div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div
						class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
					></div>
				</div>
				<div class="w-[70%] md:w-[80%] transition text-left text-50">
					{group.posts.length}
					{i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
				</div>
			</div>

			{#each group.posts as post (post.slug)}
				<a
					href={getPostUrlBySlug(post.slug)}
					aria-label={post.data.title}
					class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
				>
					<div class="flex flex-row justify-start items-center h-full">
						<div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
							{formatArchiveDate(post.data.published)}
						</div>

						<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
							<div
								class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0_0)] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
							></div>
						</div>

						<div
							class="w-[70%] text-left font-bold group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)] text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
							class:md:max-w-[65%]={showTags}
							class:md:w-[65%]={showTags}
							class:md:w-[80%]={!showTags}
						>
							{post.data.title}
						</div>

						{#if showTags}
							<div
								class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
							>
								{formatArchiveTags(post.data.tags)}
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
		{/each}
	{/if}
</div>
