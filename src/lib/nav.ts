import type { Page } from "./types/page.interface";

export const pageElements: Page[] = [
  {
    name: "Overview",
    url: "/overview"
  },
  {
    name: "Access Control",
    url: "/access-control"
  },
  {
    name: "Access Modifiers",
    url: "/access-modifiers",
  },
  {
    name: "Tokens",
    url: "/tokens",
    options: [
      {
        name: "NFT (ERC721)",
        url: "/tokens/nft"
      },
      {
        name: "Fungible Token (ERC20)",
        url: "/tokens/ft"
      },
    ],
  },
];