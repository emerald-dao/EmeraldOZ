---
title: NonFungibleToken (ERC721)
language: en
---

<script>
  import Notice from '$lib/components/atoms/Notice.svelte';
</script>

# NonFungibleToken (ERC721)

We've discussed how you can make a fungible token using FungibleToken, but what if not all tokens are alike? This comes up in situations like real estate, voting rights, or collectibles, where some items are valued more than others, due to their usefulness, rarity, etc. NonFungibleToken is a standard for representing ownership of non-fungible tokens, that is, where each token is unique.

<Notice type="tip">
  Cadence does not support inheritence. Unlike ERC721, we will not be inheriting functions & variables. Rather, NonFungibleToken lists a set of <i>requirements</i> we will implement ourselves.
</Notice>

## Constructing a NonFungibleToken Contract

We'll use NonFungibleToken to track items in our game, which will each have their own unique attributes. Whenever one is to be awarded to a player, it will be minted and sent to them. Players are free to keep their token or trade it with other people as they see fit, as they would any other asset on the blockchain! Please note any account can call awardItem to mint items. To restrict what accounts can mint items we can add an Admin resource.

Here's what a contract for tokenized items might look like:

```cadence
/* 
*
*  This is an example implementation of a Flow Non-Fungible Token
*  It is not part of the official standard but it assumed to be
*  similar to how many NFTs would implement the core functionality.
*
*  This contract does not implement any sophisticated classification
*  system for its NFTs. It defines a simple NFT with minimal metadata.
*   
*/

import NonFungibleToken from "./NonFungibleToken.cdc"

pub contract ExampleNFT: NonFungibleToken {

    /// Total supply of ExampleNFTs in existence
    pub var totalSupply: UInt64

    /// The event that is emitted when the contract is created
    pub event ContractInitialized()

    /// The event that is emitted when an NFT is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)

    /// The event that is emitted when an NFT is deposited to a Collection
    pub event Deposit(id: UInt64, to: Address?)

    /// Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    /// The core resource that represents a Non Fungible Token. 
    /// New instances will be created using the NFTMinter resource
    /// and stored in the Collection resource
    ///
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        
        /// The unique ID that each NFT has
        pub let id: UInt64
        // incremental ID
        pub let serial: UInt64 
        pub let name: String
    
        init(name: String) {
            self.id = self.uuid // a unique identifier across all resources
            self.serial = EmeraldNFT.totalSupply
            self.name = name

            ExampleNFT.totalSupply = ExampleNFT.totalSupply + 1
        }
    }

    /// Defines the methods that are particular to this NFT contract collection
    ///
    pub resource interface ExampleNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowExampleNFT(id: UInt64): &ExampleNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ExampleNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    /// The resource that will be holding the NFTs inside any account.
    /// In order to be able to manage NFTs any account will need to create
    /// an empty collection first
    ///
    pub resource Collection: ExampleNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        /// Removes an NFT from the collection and moves it to the caller
        ///
        /// @param withdrawID: The ID of the NFT that wants to be withdrawn
        /// @return The NFT resource that has been taken out of the collection
        ///
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        /// Adds an NFT to the collections dictionary and adds the ID to the id array
        ///
        /// @param token: The NFT resource to be included in the collection
        /// 
        pub fun deposit(token: @NonFungibleToken.NFT) {
          let token <- token as! @ExampleNFT.NFT
          emit Deposit(id: id, to: self.owner?.address)
          self.ownedNFTs[id] <-! token
        }

        /// Helper method for getting the collection IDs
        ///
        /// @return An array containing the IDs of the NFTs in the collection
        ///
        pub fun getIDs(): [UInt64] {
          return self.ownedNFTs.keys
        }

        /// Gets a reference to an NFT in the collection so that 
        /// the caller can read its metadata and call its methods
        ///
        /// @param id: The ID of the wanted NFT
        /// @return A reference to the wanted NFT resource
        ///
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
          return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }
 
        /// Gets a reference to an NFT in the collection so that 
        /// the caller can read its metadata and call its methods
        ///
        /// @param id: The ID of the wanted NFT
        /// @return A reference to the wanted NFT resource
        ///        
        pub fun borrowExampleNFT(id: UInt64): &ExampleNFT.NFT? {
          if self.ownedNFTs[id] != nil {
            // Create an authorized reference to allow downcasting
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return ref as! &ExampleNFT.NFT
          }

          return nil
        }

        init () {
          self.ownedNFTs <- {}
        }

        destroy() {
          destroy self.ownedNFTs
        }
    }

    /// Allows anyone to create a new empty collection
    ///
    /// @return The new Collection resource
    ///
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    /// Resource that an admin or something similar would own to be
    /// able to mint new NFTs
    ///
    pub resource Minter {
        pub fun mintNFT(recipient: &Collection{NonFungibleToken.CollectionPublic}, name: String) {
            // create a new NFT
            var newNFT <- create NFT(name: name)
            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <- newNFT)
        }
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/EmeraldNFTCollection
        self.CollectionPublicPath = /public/EmeraldNFTCollection
        self.MinterStoragePath = /storage/EmeraldNFTMinter

        // save a Minter to the deployer's account storage
        self.account.save(<- create NFTMinter(), to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
```

The MetadataViews contract defines different ways to view and structure NFT Metadata. See <a href="">here</a> for a complete implementation of NonFungibleToken that includes the metadata standard extensions (MetadataViews).

<Notice type="note">
  You'll notice that the item's metadata is stored on chain. All metadata is stored on chain in Cadence, except for heavy data like images.
</Notice>