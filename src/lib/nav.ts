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
        name: "FungibleToken (ERC20)",
        url: "/fungible-token"
      },
      {
        name: "NonFungibleToken (ERC721)",
        url: "/non-fungible-token"
      },
    ],
  },
];