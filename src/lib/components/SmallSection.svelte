<script type="ts">
  export let title: string;
</script>

<div class="column-6">
  <h3>{title}</h3>
  <slot />
</div>

<style type="scss">
  h3 {
    font-size: 1.4rem;
  }
</style>
