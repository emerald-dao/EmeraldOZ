<script type="ts">
  export let pro = true;
</script>

<div class="tip" class:pro>
  <p><slot /></p>
</div>

<style type="scss">
  .tip {
    border: 1px solid var(--clr-border-primary);
    border-left-width: 15px;
    border-radius: var(--radius-1);
    font-size: 0.9rem;
    line-height: 1.5;
    max-width: 90vw;
    overflow-wrap: break-word;
    padding: 1rem 1.5rem;
    border-left-color: var(--clr-alert-main);
    box-sizing: border-box;
    display: block;
    margin-top: 1em;
    margin-bottom: 2em;
  }

  .tip::before {
    color: var(--clr-alert-main);
    content: "Con";
    display: block;
    font-size: 0.9em;
    margin-bottom: 0.5rem;
    text-align: left;
    text-transform: uppercase;
  }

  .pro {
    border-left-color: var(--clr-success-main);
  }

  .pro::before {
    color: var(--clr-success-main);
    content: "Pro";
  }

  p {
    margin: 0px;
  }
</style>
