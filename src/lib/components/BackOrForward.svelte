<script type="ts">
  import type { Page } from "$lib/types/page.interface";
  import Icon from "@iconify/svelte";

  export let previousComponent: Page | null;
  export let nextComponent: Page | null;
</script>

<div class="wrapper">
  {#if previousComponent}
    <a class="step-back each-adjacent-wrapper" href={previousComponent.url}>
      <Icon icon="tabler:arrow-left" style="color: var(--clr-text-main);" />
      <div class="left-wrapper column-2">
        <p class="heading w-medium">
          {previousComponent.name}
        </p>
      </div>
    </a>
  {/if}
  {#if nextComponent}
    <a class="step-next each-adjacent-wrapper" href={nextComponent.url}>
      <div class="column-2">
        <p class="heading w-medium">
          {nextComponent.name}
        </p>
      </div>
      <Icon icon="tabler:arrow-right" style="color: var(--clr-text-main);" />
    </a>
  {/if}
</div>

<style type="scss">
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "start end";
    gap: var(--space-4);

    a {
      text-decoration: none;
    }

    .step-back {
      grid-area: start;
    }

    .step-next {
      grid-area: end;

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
