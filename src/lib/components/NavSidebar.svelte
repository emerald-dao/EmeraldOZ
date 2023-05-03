<nav>
  <h3>Contracts</h3>
  <ul class="main-ui">
    <li>
      Overview
      <ul class="sub-ui">
        <li>Installation</li>
        <li>Usage</li>
      </ul>
    </li>
    <li>Security</li>
    <li>Learn More</li>
  </ul>
</nav>

<style type="scss">
  nav {
    font-size: 0.9em;
    opacity: 0.8;
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: var(--space-8);
    max-height: 80vh;
    overflow-y: auto;
    position: sticky;
    top: 10vh;
    width: 200px;
    box-sizing: border-box;
    border-width: 0 0 0 0.25rem;

    @media all and (max-width: 1000px) {
      display: none;
    }

    h3 {
      color: var(--clr-text-off);
      font-size: inherit;
      letter-spacing: 0.05em;
      margin: 0;
      padding: 0;
      text-transform: uppercase;
    }

    .main-ui {
      line-height: 1.2;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        margin: 0.5rem 0 0;
        overflow: hidden;
        padding-bottom: var(--space-1);
        padding-right: var(--space-2);
        padding-top: var(--space-1);
        text-overflow: ellipsis;
        font-weight: bold;
      }

      .sub-ui {
        margin-left: 0.5em;
        line-height: 1.2;
        list-style: none;
        padding: 0;
        font-size: 0.9em;

        li {
          margin-top: 0.25rem 0 0;
          font-weight: none;
        }
      }
    }
  }
</style>
