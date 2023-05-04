<script type="ts">
  import { setContext } from "svelte";

  export let data;
  console.log(data);

  $: setContext("metadata-context", data.metadata);
</script>

<article>
  <svelte:component this={data.content} />
</article>
<h1>gg</h1>

<style type="scss">
  section {
    padding-block: 0;

    @include mq(medium) {
      padding-block: 4rem;
    }
  }
  article {
    margin-top: var(--space-6);
    word-break: break-word;
  }
</style>
