<script type="ts">
  export let title: string;
</script>

<h2>{title}</h2>
<slot />

<style type="scss">
  h2 {
    border-bottom: 1px solid var(--clr-border-primary);
    padding-top: 0.75em;
    margin-bottom: var(--space-8);
    font-size: 1.6rem;
    padding-bottom: 0.3rem;
  }
</style>
