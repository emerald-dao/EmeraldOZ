---
title: Tokens
lesson: 1
language: en
excerpt: basic blockchain concepts
quizUrl: https://forms.gle/dCaMDJWoko54xkiv5
---

<script>
  import Notice from '$lib/components/atoms/Notice.svelte';   
</script>

# Tokens

Ah, the "token": blockchain's most powerful and most misunderstood tool.

A token is a representation of something in the blockchain. This something can be money, time, services, shares in a company, a virtual pet, anything. By representing things as tokens, we can allow smart contracts to interact with them, exchange them, create or destroy them.

## But First, <s>Coffee</s> a Primer on Token Contracts

Much of the confusion surrounding tokens comes from two concepts getting mixed up: token contracts and the actual tokens.

A token contract is simply a smart contract written in Cadence. However, the tokens themselves are data stored on chain. 

In the fungible case, tokens are represented simply as a number called "balance" that is added/subtracted to in a user's Vault resource, which is an object (or "resource") a user stores in their account. In the non-fungible case, tokens are represented as objects (or "resources") that literally get moved in and out of a user's NFT Collection resource, which is also an object a user stores in their account.

It is these balances/resources that represent the tokens themselves. Someone "has tokens" when their balance in their Vault is non-zero, or if they store non-zero amounts of NFT resources. That's it! These balances could be considered money, experience points in a game, deeds of ownership, or voting rights, and each of these tokens would be stored in different token contracts.

## Different Kinds of Tokens

Note that there's a big difference between having two voting rights and two deeds of ownership: each vote is equal to all others, but houses usually are not! This is called fungibility. Fungible goods are equivalent and interchangeable, like Ether, fiat currencies, and voting rights. Non-fungible goods are unique and distinct, like deeds of ownership, or collectibles.

In a nutshell, when dealing with non-fungibles (like your house) you care about which ones you have, while in fungible assets (like your bank account statement) what matters is how much you have.

## Standards

Even though the concept of a token is simple, they have a variety of complexities in the implementation. Because everything in Cadence is just a mix of smart contracts and their associated transactions and scripts, and there are no rules about what smart contracts have to do, the Flow team has developed a variety of standards for documenting how a contract can interoperate with other contracts.

You've probably heard of the FungibleToken (ERC20) or NonFungibleToken (ERC721) token standards, and that's why you're here. Head to our specialized guides to learn more about these:

- <a href="fungible-token">FungibleToken</a>: the most widespread token standard for fungible assets, albeit somewhat limited by its simplicity.
- <a href="non-fungible-token">NonFungibleToken</a>: the de-facto solution for non-fungible tokens, often used for collectibles and games.