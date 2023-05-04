<script type="ts">
	import "../app.postcss";
	import "@emerald-dao/design-system/build/variables-dark.css";
	import "@emerald-dao/design-system/build/variables-light.css";
	import "@emerald-dao/design-system/build/variables.css";
	import "@emerald-dao/component-library/styles/app.scss";
	import "$lib/styles/_articles.scss";
	import { theme } from "$stores/ThemeStore";
	import { Header, Footer, Accordion } from "@emerald-dao/component-library";
	import { page } from "$app/stores";
	import { pageElements } from "$lib/nav";
	import Icon from "@iconify/svelte";
	import CourseTitlesHeader from "$lib/components/CourseTitlesHeader.svelte";
	import CourseTitlesOpen from "$lib/components/CourseTitlesOpen.svelte";

	let navElements = [
		{
			name: "GitHub",
			url: "/docs",
			prefetch: true,
		},
		{
			name: "Forum",
			url: "/docs",
			prefetch: true,
		},
		{
			name: "Website",
			url: "/docs",
			prefetch: true,
		},
	];

	let open: boolean;

	const handleClick = () => (open = !open);

	$: $page.params && (open = false);
</script>

<Header
	themeStore={theme}
	{navElements}
	logoHref={"/"}
	logoUrl="/ec_logo.png"
	logoText="Emerald OZ"
/>

<main>
	<div class="container-large">
		<div class="sidebar">
			{#each pageElements as pageElement, index}
				<div class="column-3">
					<a
						href={`${pageElement.url}`}
						class="header-link chapter"
						class:active={pageElement.url === $page.url.pathname}
					>
						{pageElement.name}
					</a>
					{#if pageElement.options}
						{#each pageElement.options as option, i}
							<a
								href={`${option.url}`}
								class="header-link header-link-sub"
								class:active={option.url === $page.url.pathname}
							>
								{option.name}
							</a>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
		<div class="accordion">
			{#each pageElements as pageElement, i}
				{#if pageElement.options}
					<Accordion>
						<div slot="header">
							<CourseTitlesHeader data={pageElement} />
						</div>
						<div slot="open">
							<CourseTitlesOpen data={pageElement} />
						</div>
					</Accordion>
				{:else}
					<CourseTitlesHeader data={pageElement} dropdown={false} />
				{/if}
			{/each}
		</div>
		<slot />
	</div>
</main>

<Footer
	{navElements}
	logoHref={"/"}
	logoUrl="/ec_logo.png"
	logoText="Emerald OZ"
/>

<style type="scss">
	.container-large {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		padding-block: 0;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 4fr;
			gap: var(--space-16);
		}
	}

	.align-center {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.sidebar {
		display: none;

		@include mq(medium) {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			border-right: 0.5px var(--clr-border-primary) solid;
			border-bottom: none;
			padding-right: var(--space-12);
			gap: var(--space-2);
			overflow-y: auto;
			position: sticky;
			top: 0;
			height: 100vh;
			padding-block: var(--space-8);
			// background-color: var(--clr-background-secondary);
		}

		.header-link {
			line-height: 1.4;
			font-size: 1rem;
			color: var(--clr-text-off);

			&.active {
				color: var(--clr-heading-main);
			}
		}

		.header-link-sub {
			font-size: 0.8rem;
			margin-left: 10px;
		}
	}

	.accordion {
		border-bottom: var(--border-width-primary) var(--clr-border-primary) solid;
		padding-block: var(--space-8);

		@include mq(medium) {
			display: none;
		}
	}

	.chapter {
		color: var(--clr-text-main);
		border-bottom: 1px var(--clr-neutral-badge) solid;
		padding-bottom: var(--space-2);
		font-family: var(--font-heading);
		font-size: 0.9rem;
	}

	::-webkit-scrollbar {
		width: 7px;
	}

	::-webkit-scrollbar-thumb {
		background: var(--clr-neutral-badge);
		border-radius: 3px;
		transition: 1.7s;
		cursor: pointer;
	}
</style>
