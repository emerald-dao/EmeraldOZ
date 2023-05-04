<script type="ts">
	import Icon from "@iconify/svelte";
	import { page } from "$app/stores";
	import type { Page } from "$lib/types/page.interface";

	export let data: Page;
	export let dropdown: boolean = true;
</script>

<div class="header">
	<div class="text">
		<div class="title-wrapper">
			<a href={data.url} class:active={data.url === $page.url.pathname}>
				{data.name}
			</a>
		</div>
		{#if dropdown}
			<div class="button-wrapper row-3">
				<div class="down-icon-wrapper">
					<Icon icon="tabler:chevron-down" />
				</div>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.header {
		cursor: pointer;

		.text {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			.title-wrapper {
				margin-left: 10px;
				span {
					margin: 0;
					font-size: var(--font-size-3);
				}
				a {
					line-height: 1.4;
					font-size: 1rem;
					color: var(--clr-text-off);
					text-decoration: none;

					&.active {
						color: var(--clr-heading-main);
					}
				}
			}

			.button-wrapper {
				align-items: center;
				justify-content: end;
			}
		}
	}
</style>
