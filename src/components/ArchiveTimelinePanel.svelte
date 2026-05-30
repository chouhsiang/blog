<script lang="ts">
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import {
	formatArchiveDate,
	formatArchiveTags,
	groupPostsByYear,
	type ArchivePost,
	type ArchiveSortOrder,
} from "@utils/archive-utils";
import { getPostUrlBySlug } from "../utils/url-utils";

interface Props {
	posts?: ArchivePost[];
	showTags?: boolean;
	heading?: string;
}

let { posts = [], showTags = true, heading = "" }: Props = $props();

let sortOrder = $state<ArchiveSortOrder>("desc");

const groups = $derived(groupPostsByYear(posts, sortOrder));

function setSortOrder(order: ArchiveSortOrder) {
	sortOrder = order;
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

		<div class="flex items-center gap-1 self-start sm:self-auto">
			<button
				type="button"
				class="btn-plain scale-animation rounded-lg h-9 px-3 text-sm font-medium active:scale-95"
				class:current-theme-btn={sortOrder === "desc"}
				onclick={() => setSortOrder("desc")}
			>
				{i18n(I18nKey.sortNewestFirst)}
			</button>
			<button
				type="button"
				class="btn-plain scale-animation rounded-lg h-9 px-3 text-sm font-medium active:scale-95"
				class:current-theme-btn={sortOrder === "asc"}
				onclick={() => setSortOrder("asc")}
			>
				{i18n(I18nKey.sortOldestFirst)}
			</button>
		</div>
	</div>

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
</div>
