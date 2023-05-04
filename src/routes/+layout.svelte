<script type="ts">
	import "../app.postcss";
	import "@emerald-dao/design-system/build/variables-dark.css";
	import "@emerald-dao/design-system/build/variables-light.css";
	import "@emerald-dao/design-system/build/variables.css";
	import "@emerald-dao/component-library/styles/app.scss";
	import "$lib/styles/_articles.scss";
	import { theme } from "$stores/ThemeStore";
	import { Header, Footer } from "@emerald-dao/component-library";
	import { page } from "$app/stores";
	import { pageElements } from "$lib/nav";

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
			<a class="header-link" href="/">Home</a>
			{#each pageElements as pageElement, index}
				<div class="column-3">
					<p class="chapter small">
						{`${index + 1}. ${pageElement.name}`}
					</p>
					{#if pageElement.options}
						{#each pageElement.options as option, i}
							<a
								href={`/${pageElement.name}/${option.name}`}
								class="header-link"
								class:active={option.url === $page.url.pathname}
							>
								{`${index + 1}.${i + 1} ${option.name}`}
							</a>
						{/each}
					{/if}
				</div>
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

	.sidebar {
		display: none;

		@include mq(medium) {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			border-right: 0.5px var(--clr-border-primary) solid;
			border-bottom: none;
			padding-right: var(--space-12);
			gap: var(--space-11);
			overflow-y: auto;
			position: sticky;
			top: 0;
			height: 100vh;
			padding-block: var(--space-8);
			// background-color: var(--clr-background-secondary);
		}

		.header-link {
			line-height: 1.4;
			font-size: 0.83rem;
			color: var(--clr-text-off);

			&.active {
				color: var(--clr-heading-main);
			}
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
