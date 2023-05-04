<script type="ts">
	import { page } from "$app/stores";
	import type { Page } from "$lib/types/page.interface";
	import { slide } from "svelte/transition";

	export let data: Page;

	let options = data.options as Page[];
</script>

<div class="details column-1" transition:slide>
	{#each options as option, index}
		<a
			href={option.url}
			class="header-link-sub"
			class:active={option.url === $page.url.pathname}
		>
			{option.name}
		</a>
	{/each}
</div>

<style type="scss">
	.details {
		padding-bottom: var(--space-2);
	}

	.header-link-sub {
		margin-left: 25px;
		font-size: 0.8rem;
		color: var(--clr-text-off);
		text-decoration: none;

		&.active {
			color: var(--clr-heading-main);
		}
	}
</style>
