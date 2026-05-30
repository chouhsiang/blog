<script lang="ts">
import Icon from "@iconify/svelte";
import {
	isNavLinkActive,
	type ResolvedNavBarLink,
} from "@utils/nav-utils";
import { url } from "@utils/url-utils";

interface Props {
	name: string;
	links: ResolvedNavBarLink[];
	currentPath: string;
}

let { name, links, currentPath }: Props = $props();

let open = $state(false);
let container: HTMLDivElement | undefined = $state();

const isActive = $derived(
	links.some((link) => isNavLinkActive(link, currentPath)),
);

function toggle() {
	open = !open;
}

function close() {
	open = false;
}

function handleDocumentClick(event: MouseEvent) {
	if (!container?.contains(event.target as Node)) {
		close();
	}
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		close();
	}
}

$effect(() => {
	if (!open) {
		return;
	}

	document.addEventListener("click", handleDocumentClick);
	document.addEventListener("keydown", handleKeydown);

	return () => {
		document.removeEventListener("click", handleDocumentClick);
		document.removeEventListener("keydown", handleKeydown);
	};
});
</script>

<div bind:this={container} class="relative">
	<button
		type="button"
		aria-label={name}
		aria-expanded={open}
		aria-haspopup="true"
		class="btn-plain scale-animation rounded-lg h-11 font-bold px-5 active:scale-95"
		class:current-theme-btn={isActive}
		onclick={toggle}
	>
		<div class="flex items-center gap-1">
			{name}
			<Icon
				icon="material-symbols:keyboard-arrow-down-rounded"
				class={`text-[1.25rem] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
			/>
		</div>
	</button>

	<div
		class="absolute left-0 top-[calc(100%+0.25rem)] min-w-[10rem] rounded-[var(--radius-large)] bg-[var(--float-panel-bg)] shadow-xl dark:shadow-none py-2 z-50 transition-all duration-200"
		class:opacity-0={!open}
		class:pointer-events-none={!open}
		class:-translate-y-1={!open}
		class:opacity-100={open}
		class:pointer-events-auto={open}
		class:translate-y-0={open}
	>
		{#each links as link (link.url ?? link.name)}
			<a
				href={link.external ? link.url : url(link.url ?? "/")}
				target={link.external ? "_blank" : undefined}
				rel={link.external ? "noopener noreferrer" : undefined}
				class="group flex items-center justify-between gap-8 py-2 pl-4 pr-3 mx-1 rounded-lg font-bold text-black/75 dark:text-white/75 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] hover:text-[var(--primary)]"
				class:text-[var(--primary)]={isNavLinkActive(link, currentPath)}
				onclick={close}
			>
				<span>{link.name}</span>
				{#if link.external}
					<Icon
						icon="fa6-solid:arrow-up-right-from-square"
						class="text-[0.75rem] text-black/25 dark:text-white/25"
					/>
				{:else}
					<Icon
						icon="material-symbols:chevron-right-rounded"
						class="text-[1.25rem] text-[var(--primary)] opacity-0 group-hover:opacity-100 transition"
					/>
				{/if}
			</a>
		{/each}
	</div>
</div>
