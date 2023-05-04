import type { Page } from "./types/page.interface";

export const pageElements: Page[] = [
  {
    name: "Overview",
    url: "/"
  },
  {
    name: "Wizard",
    url: "/wizard"
  },
  {
    name: "Extending Contracts",
    url: "/extending-contracts"
  },
  {
    name: "Access Control",
    url: "/access-control"
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