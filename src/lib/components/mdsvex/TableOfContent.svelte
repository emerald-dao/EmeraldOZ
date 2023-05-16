<script type="ts">
	import { transformHeadingToUrl } from "$lib/utilities/dataTransformation/transformHeadingToUrl";
	import { getContext, onMount, tick } from "svelte";
	import { ProgressSteps } from "@emerald-dao/component-library";
	import type { ProgressStates } from "@emerald-dao/component-library/components/ProgressStep/progress-states.type";
	import { page } from "$app/stores";
	import EditContent from "../atoms/EditContent.svelte";
	import Icon from "@iconify/svelte";

	export let headings: Heading[];
	console.log(headings);

	interface Heading {
		level: number;
		title: string;
	}

	let elements: HTMLElement[] = [];

	function grabElements() {
		if (headings.length > 0) {
			headings.forEach((headingElement) => {
				const el = document.getElementById(
					`${transformHeadingToUrl(headingElement.title)}`
				);
				if (el) {
					elements = [...elements, el];
				}
			});
		}
	}

	async function trackScroll() {
		await tick();

		elements.forEach(async (element, i) => {
			const { top, width } = element.getBoundingClientRect();
			if (width === 0) grabElements(); // fixes weird bug where rects are all 0
			if (top < 200) {
				steps.forEach((step, index) => {
					if (i > index) {
						step.state = "success";
					} else if (i === index) {
						step.state = "active";
					} else {
						step.state = "inactive";
					}
					steps = steps;
				});
			}
		});
	}

	let steps: Step[] = [];

	interface Step {
		name: string;
		state: ProgressStates;
	}

	function tranformHeadingsToSteps() {
		headings.forEach((heading) => {
			if (heading.level > 1) {
				steps.push({
					name: heading.title,
					state: "inactive",
					url: `#${transformHeadingToUrl(heading.title)}`,
				});
				steps = steps;
			}
		});
	}

	let questsExist = false;
	$: questsExist = headings.some((item) => item.title === "Quests");

	onMount(() => {
		grabElements();
		trackScroll();
		tranformHeadingsToSteps();
	});

	const metadata = getContext("metadata-context");
</script>

<svelte:window on:scroll={trackScroll} />

<div class="column-10">
	<!-- {#if author}
		<div class="row-2">
			{#if author.avatarUrl}
				<img src={author.avatarUrl} alt="User avatar" />
			{:else}
				<img src="/new-avatar.png" alt="Generic avatar" />
			{/if}
			<div class="column">
				<p>Author</p>
				<a
					href={author.socialMediaUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="header-link row-2 align-center"
				>
					<p>{author.name} ↗</p>
				</a>
			</div>
		</div>
	{/if} -->
	<div class="steps-wrapper">
		<ProgressSteps
			{steps}
			diameter={0.5}
			direction="column-reverse"
			fontSize="xsmall"
			gap={0.4}
			cutLineEnds={false}
			lineHeight="1"
		/>
	</div>
	<div class="column-6 bottom-links-wrapper">
		{#if metadata.lessonVideoUrl}
			<div class="column-3">
				<a href="#" class={`header-link row-2 align-center`}>
					<Icon icon="bi:camera-video" />
					<p class="w-small">Video lesson</p>
				</a>
			</div>
		{/if}
		<EditContent
			href={`https://github.com/emerald-dao/EmeraldOZ/tree/main/src/lib/content/${$page.params.name}.md`}
			target="_blank"
		/>
	</div>
</div>

<style lang="scss">
	a {
		color: var(--clr-heading-main);
	}
	.row-2 {
		align-items: center;

		img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			margin-block: 0;
		}
		p {
			margin-bottom: 0px;
			margin-top: 0px;
		}
	}

	.steps-wrapper {
		margin-left: 10px;
	}
	.bottom-links-wrapper {
		margin-left: var(--space-4);
	}
</style>
