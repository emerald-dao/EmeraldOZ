import Overview from "./pages/Overview.svelte";
import type { Page } from "./types/page.interface";

export const pageElements: Page[] = [
  {
    name: "Overview",
    url: "/",
    component: Overview
  },
  {
    name: "Wizard",
    url: "/wizard",
    component: Overview
  },
  {
    name: "Extending Contracts",
    url: "/extending-contracts",
    component: Overview
  },
  {
    name: "Access Control",
    url: "/access-control",
    component: Overview
  },
  {
    name: "Tokens",
    url: "/tokens",
    component: Overview,
    options: [
      {
        name: "NFT (ERC721)",
        url: "/tokens/nft",
        component: Overview
      },
      {
        name: "Fungible Token (ERC20)",
        url: "/tokens/ft",
        component: Overview
      },
    ],
  },
];