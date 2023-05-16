<script type="ts">
  import { page } from "$app/stores";
  import { pageElements } from "$lib/nav";
  import Icon from "@iconify/svelte";
  import { setContext } from "svelte";

  export let data;

  $: findExampleIndex = pageElements.findIndex(
    (ele) => ele.url === $page.url.pathname
  );
  $: previousExample = pageElements[findExampleIndex - 1];
  $: nextExample = pageElements[findExampleIndex + 1];

  $: setContext("metadata-context", data.metadata);
</script>

<section>
  <article>
    <svelte:component this={data.content} />
  </article>
  <div class="adjacents-wrapper">
    {#if previousExample}
      <a
        class="step-back each-adjacent-wrapper"
        href={`${previousExample.url}`}
      >
        <Icon icon="tabler:arrow-left" style="color: var(--clr-text-main);" />
        <div class="left-wrapper column-2">
          <p class="heading w-medium">
            {previousExample.name}
          </p>
        </div>
      </a>
    {/if}
    {#if nextExample}
      <a class="step-next each-adjacent-wrapper" href={`${nextExample.url}`}>
        <div class="column-2">
          <p class="heading w-medium">
            {nextExample.name}
          </p>
        </div>
        <Icon icon="tabler:arrow-right" style="color: var(--clr-text-main);" />
      </a>
    {/if}
  </div>
</section>

<style type="scss">
  section {
    padding-block: 0;
    padding-bottom: 4em;
  }
  article {
    margin-top: var(--space-6);
    word-break: break-word;
  }

  .adjacents-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-11);

    @include mq(medium) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "start end";
      gap: var(--space-4);
    }

    a {
      text-decoration: none;
    }

    .step-back {
      grid-area: start;
    }

    .step-next {
      grid-area: end;
      margin-top: var(--space-4);

      @include mq(medium) {
        margin-top: 0;
      }
    }

    .each-adjacent-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-5);
      padding: var(--space-4) var(--space-5);
      border-radius: var(--radius-2);
      border: var(--border-width-primary) var(--clr-border-primary) solid;

      .left-wrapper {
        text-align: end;
      }
    }
  }
</style>
