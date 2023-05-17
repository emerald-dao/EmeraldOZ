import type { Page } from "./types/page.interface";

export const pageElements: Page[] = [
  {
    name: "Overview",
    url: "/overview"
  },
  {
    name: "Account Model",
    url: "/account-model"
  },
  {
    name: "Access Control",
    url: "/access-control"
  },
  {
    name: "Admin Access",
    url: "/admin-access",
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