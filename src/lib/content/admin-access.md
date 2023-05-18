---
title: Admin Access
language: en
---

<script>
  import Notice from '$lib/components/atoms/Notice.svelte'; 
</script>

# Admin Access

While <a href="/access-control">Access Control</a> focuses primarily on *who* can take certain actions, there are many patterns around *what*-the code itself-can access certain actions.

<Notice type="tip">
  If you have not learned about Access Modifiers yet, head to the <a href="https://academy.ecdao.org/en/catalog/courses/beginner-cadence/chapter3/lesson5" target="_blank">Chapter on Access Control in the Beginner Cadence Course</a> created by us.
</Notice>

## Admin Access to User Data

There are times when we want our smart contracts, or "Admin", to have control over user data while disallowing the general public from having that same control. The difficulty in Cadence is that, unlike central ledger-based smart contract languages like <a href="https://soliditylang.org/" target="_blank">Solidity</a> which store data in the contract, users own their own and have full control over their data in their account storage. So how do we get users to give that control over their data to an Admin while not allowing the public to do so?

Let's say we have an non-standardized NonFungibleToken contract (for simplicity sake) where users can mint NFTs. At a later point, the Admin should be able to upgrade a user's NFT metadata to a higher tier.

```cadence
pub contract EmeraldNFT {
  pub enum Rarity: UInt8 {
    pub case Common // 0
    pub case Rare // 1
    pub case Epic // 2
    pub case Legendary // 3
  }

  pub resource NFT {
    pub let id: UInt64
    pub let name: String
    pub var rarity: Rarity

    // This function can only be called inside this contract
    access(contract) fun upgradeRarity() {
      let rawValue = self.rarity.rawValue
      assert(rawValue != 3, message: "This NFT is already legendary!")
      self.rarity = Rarity(rawValue: rawValue + 1)!
    }

    init(name: String) {
      self.id = self.uuid
      self.name = name
      self.rarity = Rarity.Common
    }
  }

  pub resource interface CollectionPublic {
    pub fun borrowNFTRef(id: UInt64): &NFT?
  }

  pub resource Collection: CollectionPublic {
    // ... full implementation not shown ...

    pub let ownedNFTs: @{UInt64: NFT}

    pub fun borrowNFTRef(id: UInt64): &NFT? {
      return &self.ownedNFTs[id]
    }

    init() {
      self.ownedNFTs <- {}
    }

    destroy() {
      destroy self.ownedNFTs
    }
  }

  pub resource Admin {
    // Add a function an Admin can call that calls
    // the `upgradeRarity` function on a user's
    // NFT reference
    pub fun upgradeUserNFT(userNFT: &NFT) {
      userNFT.upgradeRarity()
    }
  }

  init() {
    self.account.save(<- create Admin(), to: /storage/EmeraldNFTAdmin)
  }
}
```

By putting the 'access(control)' modifier on the 'upgradeRarity' function inside the NFT resource, we restrict it to only being callable inside the contract. This allows us to define an 'Admin' resource that calls that function. No one else will be able to call it since it is not defined in the contract.