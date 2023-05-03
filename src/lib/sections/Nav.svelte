<script>
  import { page } from "$app/stores";
  import { pageElements } from "$lib/nav";
</script>

<nav>
  <div class="main-nav">
    <h3>Contracts</h3>
    <ol class="primary-list">
      {#each pageElements as pageElement}
        <li class="primary-option">
          <a
            class:selected={pageElement.url === $page.url.pathname}
            href={pageElement.url}
          >
            {pageElement.name}
          </a>
          {#if pageElement.options}
            <ol class="secondary-list">
              {#each pageElement.options as option}
                <li class="secondary-option">
                  <a
                    class:selected={option.url === $page.url.pathname}
                    href={option.url}
                  >
                    {option.name}
                  </a>
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</nav>

<style type="scss">
  nav {
    flex: 0 0 auto;
    height: 100vh;
    overflow-y: auto;
    position: sticky;
    top: 0;
    width: 300px;
    background: var(--clr-background-secondary);
    padding: 1rem;

    @media all and (max-width: 1000px) {
      display: none;
    }

    .main-nav {
      min-height: 100%;
      overflow-y: auto;

      h3 {
        align-items: center;
        margin: 2rem 0 0.75rem 0;
        font-size: 1.3rem;
        padding: 0 1rem;
      }

      .primary-list {
        margin: var(--space-4) 0;
        list-style: none;
        padding: 0;

        .primary-option {
          line-height: 1.5rem;
          margin-bottom: 0.5rem;
          margin-left: 1.3rem;

          a {
            text-decoration: none;
            color: var(--clr-text-main);
          }
          .selected {
            color: var(--clr-primary-main);
          }
        }
      }

      .secondary-list {
        list-style: none;
        margin-top: var(--space-2);
        margin-bottom: var(--space-4);
        padding: 0;

        .secondary-option {
          margin-bottom: 0.5rem;
          margin-left: 1.3rem;
        }
      }
    }
  }
</style>
