---
title: FungibleToken (ERC20)
language: en
---

<script>
  import Notice from '$lib/components/atoms/Notice.svelte';
</script>

# FungibleToken (ERC20)

A FungibleToken contract keeps track of fungible tokens: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes FungibleTokens useful for things like a medium of exchange currency, voting rights, staking, and more.

<Notice type="tip">
  Cadence does not support inheritence. Unlike ERC20, we will not be inheriting functions & variables. Rather, FungibleToken lists a set of <i>requirements</i> we will implement ourselves.
</Notice>

## Constructing a FungibleToken Contract

Using Contracts, we can easily create our own ERC20 token contract, which will be used to track Emerald Token (EMLD), an internal currency in a hypothetical game.

Here's what our EMLD token might look like.

```cadence
import FungibleToken from "./FungibleToken.cdc"

pub contract ExampleToken: FungibleToken {

    /// Total supply of ExampleTokens in existence
    pub var totalSupply: UFix64
    
    /// Storage and Public Paths
    pub let VaultStoragePath: StoragePath
    pub let VaultPublicPath: PublicPath
    pub let ReceiverPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    /// The event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    /// The event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// The event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    /// The event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    /// Each user stores an instance of only the Vault in their storage
    /// The functions in the Vault and governed by the pre and post conditions
    /// in FungibleToken when they are called.
    /// The checks happen at runtime whenever a function is called.
    ///
    /// Resources can only be created in the context of the contract that they
    /// are defined in, so there is no way for a malicious user to create Vaults
    /// out of thin air. A special Minter resource needs to be defined to mint
    /// new tokens.
    ///
    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance, MetadataViews.Resolver {

        /// The total balance of this vault
        pub var balance: UFix64

        /// Function that takes an amount as an argument
        /// and withdraws that amount from the Vault.
        /// It creates a new temporary Vault that is used to hold
        /// the money that is being transferred. It returns the newly
        /// created Vault to the context that called so it can be deposited
        /// elsewhere.
        ///
        /// @param amount: The amount of tokens to be withdrawn from the vault
        /// @return The Vault resource containing the withdrawn funds
        ///
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
          self.balance = self.balance - amount
          emit TokensWithdrawn(amount: amount, from: self.owner?.address)
          return <- create Vault(balance: amount)
        }

        /// Function that takes a Vault object as an argument and adds
        /// its balance to the balance of the owners Vault.
        /// It is allowed to destroy the sent Vault because the Vault
        /// was a temporary holder of the tokens. The Vault's balance has
        /// been consumed and therefore can be destroyed.
        ///
        /// @param from: The Vault resource containing the funds that will be deposited
        ///
        pub fun deposit(from: @FungibleToken.Vault) {
          let vault <- from as! @ExampleToken.Vault
          self.balance = self.balance + vault.balance
          emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
          vault.balance = 0.0
          destroy vault
        }

        /// Initialize the balance at resource creation time
        init(balance: UFix64) {
          self.balance = balance
        }

        destroy() {
          if self.balance > 0.0 {
            ExampleToken.totalSupply = ExampleToken.totalSupply - self.balance
          }
        }
    }

    /// Function that creates a new Vault with a balance of zero
    /// and returns it to the calling context. A user must call this function
    /// and store the returned Vault in their storage in order to allow their
    /// account to be able to receive deposits of this token type.
    ///
    /// @return The new Vault resource
    ///
    pub fun createEmptyVault(): @Vault {
      return <-create Vault(balance: 0.0)
    }

    /// Resource object that token admin accounts can hold to mint new tokens.
    ///
    pub resource Minter {
        /// Function that mints new tokens, adds them to the total supply,
        /// and returns them to the calling context.
        ///
        /// @param amount: The quantity of tokens to mint
        /// @return The Vault resource containing the minted tokens
        ///
        pub fun mintTokens(amount: UFix64): @ExampleToken.Vault {
          pre {
              amount > 0.0: "Amount minted must be greater than zero"
          }
          ExampleToken.totalSupply = ExampleToken.totalSupply + amount
          emit TokensMinted(amount: amount)
          return <- create Vault(balance: amount)
        }

        init(allowedAmount: UFix64) {
          self.allowedAmount = allowedAmount
        }
    }

    init() {
        self.totalSupply = 1000.0
        self.VaultStoragePath = /storage/EmeraldTokenVault
        self.VaultPublicPath = /public/EmeraldTokenMetadata
        self.ReceiverPublicPath = /public/EmeraldTokenReceiver
        self.MinterStoragePath = /storage/EmeraldTokenMinter

        // Create the Vault with the total supply of tokens and save it in storage.
        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<- vault, to: self.VaultStoragePath)

        // Create a public capability to the stored Vault that exposes
        // the `deposit` method through the `Receiver` interface.
        self.account.link<&Vault{FungibleToken.Receiver}>(
          self.ReceiverPublicPath,
          target: self.VaultStoragePath
        )

        // Create a public capability to the stored Vault that only exposes
        // the `balance` field
        self.account.link<&Vault{FungibleToken.Balance}>(
          self.VaultPublicPath,
          target: self.VaultStoragePath
        )

        self.account.save(<- create Minter(), to: self.MinterStoragePath)

        // Emit an event that shows that the contract was initialized
        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
```

We're creating an 'initialSupply' of tokens, which will be stored in a vault by the account that deploys the contract.