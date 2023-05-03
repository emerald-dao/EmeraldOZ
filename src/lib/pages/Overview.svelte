<script>
  import List from "$lib/components/List.svelte";
  import MediumSection from "$lib/components/MediumSection.svelte";
  import NavSidebar from "$lib/components/NavSidebar.svelte";
  import PrismJs from "$lib/components/PrismJS.svelte";
  import SmallSection from "$lib/components/SmallSection.svelte";
  import Tip from "$lib/components/Tip.svelte";

  let code_sample = `npm run start`;
</script>

<div class="main-content">
  <h1>Contracts</h1>
  <div>
    <p>
      A library for secure smart contract development. Build on a solid
      foundation of community-vetted code.
    </p>
    <List>
      <li class="small-margin">
        Implementations of standards like ERC20 and ERC721.
      </li>
      <li class="small-margin">
        Implementations of standards like ERC20 and ERC721.
      </li>
      <li class="small-margin">
        Implementations of standards like ERC20 and ERC721.
      </li>
    </List>
  </div>

  <MediumSection title="Overview">
    <SmallSection title="Installation">
      <p>
        OpenZeppelin Contracts features a stable API, which means your contracts
        won’t break unexpectedly when upgrading to a newer minor version.
      </p>
      <PrismJs language="bash" code={code_sample} />
      <Tip />
    </SmallSection>
  </MediumSection>
</div>

<style type="scss">
  .main-content {
    padding-bottom: var(--space-8);
    flex-grow: 1;
    min-width: 0;

    h1 {
      border-bottom: 1px solid var(--clr-border-primary);
      padding-top: 0.75em;
      margin-bottom: var(--space-8);
      font-size: 1.8rem;
      padding-bottom: 0.4rem;
    }
  }
</style>
