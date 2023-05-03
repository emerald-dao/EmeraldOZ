<script type="ts">
	import "../app.postcss";
	import "@emerald-dao/design-system/build/variables-dark.css";
	import "@emerald-dao/design-system/build/variables-light.css";
	import "@emerald-dao/design-system/build/variables.css";
	import "@emerald-dao/component-library/styles/app.scss";

	import { theme } from "$stores/ThemeStore";
	import { Header, Footer } from "@emerald-dao/component-library";
	import Nav from "$lib/sections/Nav.svelte";
	import NavSidebar from "$lib/components/NavSidebar.svelte";
	import { page } from "$app/stores";
	import BackOrForward from "$lib/components/BackOrForward.svelte";
	import { pageElements } from "$lib/nav";

	let largeScreenNav = [
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

	let x = 0;

	$: navElements = x >= 1000 ? largeScreenNav : pageElements;
	$: currentPageIndex = pageElements.findIndex(
		(ele) => ele.url === $page.url.pathname
	);
	$: previousComponent =
		currentPageIndex > 0 ? pageElements[currentPageIndex - 1] : null;
	$: nextComponent =
		currentPageIndex < pageElements.length - 1
			? pageElements[currentPageIndex + 1]
			: null;
</script>

<svelte:window bind:innerWidth={x} />

<main>
	<Nav />
	<div class="main-app">
		<Header
			themeStore={theme}
			{navElements}
			logoHref={"/"}
			logoUrl="/ec_logo.png"
			logoText="Emerald City"
		/>
		<div class="main-section">
			<div>
				<svelte:component this={pageElements[currentPageIndex].component} />
				<!-- back or forward -->
				<BackOrForward {previousComponent} {nextComponent} />
			</div>
			<NavSidebar />
		</div>
	</div>
</main>

<Footer
	{navElements}
	logoHref={"/"}
	logoUrl="/ec_logo.png"
	logoText="Emerald City"
/>

<style type="scss">
	main {
		display: flex;
		flex-direction: row;
		min-width: 0;

		.main-app {
			width: calc(100vw - 300px);

			@media all and (max-width: 1000px) {
				width: calc(100vw);
			}

			.main-section {
				align-items: flex-start;
				display: flex;
				flex-direction: row;
				flex-grow: 1;
				margin: 0 var(--space-8);
				max-width: 60rem;

				@media all and (max-width: 1000px) {
					max-width: none;
				}
			}
		}
	}
</style>
