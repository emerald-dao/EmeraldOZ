---
title: Account Model
language: en
---

<script>
  import Tip from '$lib/components/atoms/Tip.svelte';
  import ProCon from '$lib/components/atoms/ProCon.svelte';   
  import LessonVideo from '$lib/components/atoms/LessonVideo.svelte';   
</script>

# Account Model

Cadence-or other resource-oriented smart contract languages like <a href="https://move-book.com/" target="_blank">Move</a>-completely differentiate themselves from central ledger-based languages such as <a href="https://soliditylang.org/" target="_blank">Solidity</a>. 

Instead of storing user data inside the contract, data is stored in the form of <a href="https://developers.flow.com/cadence/language/resources" target="_blank">Resources</a> inside user accounts. This means users completely own and control their data once it is in their account, unless the user explicity allows their data to be accessed/modified through published <a href="https://developers.flow.com/cadence/language/capability-based-access-control" target="_blank">Capabilities</a>.

## Solidity vs. Cadence

In the Solidity world, all data is stored inside of the contract. The contract acts as a central ledger. 

Furthermore, assets such as NFTs are represented as simple integers. If we wanted to know who owned a specific NFT (with 'id' == 4), we would go inside the contract and ask "what is the address associated with 'id' == 4?"

<img src="https://i.imgur.com/tLE4YOs.png" width="300px" />

However in Cadence, two things differ:
1. Data is stored in user accounts, not the contract
2. Assets such as NFTs are represented as actual objects ("resources") that can store their own data and functions

This has a lot of benefits. Namely, resources have built-in properties that make them extremely secure. They cannot be copied or lost. 

Let's take a look at an NFT example in Cadence:

<img src="https://i.imgur.com/g0y5MWz.png" />

While definitions of the NFT resource and Collection are made in the contract, the user actually stores a Collection resource inside their account.

## Example Implementation

Below is an example smart contract & associated transaction leveraging the resource-oriented nature of Cadence, and showing how they get stored in accounts.

```cadence
pub contract Test {

  // define a new Profile resource
  pub resource Profile {
    pub let id: UInt64
    pub let name: String
    pub let favoriteNumber: Int

    init(name: String, favoriteNumber: Int) {
      self.id = self.uuid // a unique identifier for every resource in existence
      self.name = name
      self.favoriteNumber = favoriteNumber
    }
  }

  // public function to create a Profile
  pub fun createProfile(name: String, favoriteNumber: Int): @Profile {
    return <- create Profile(name: name, favoriteNumber: favoriteNumber)
  }

}
```

```cadence
import Test from 0x01

transaction(name: String, favoriteNumber: Int) {
  prepare(signer: AuthAccount) {
    // a new 'Profile' resource is created
    let newProfile <- Profile.createProfile(name: name, favoriteNumber: favoriteNumber)
    // the 'Profile' gets stored in the user's account
    signer.save(<- newProfile, to: /storage/TestProfile)
  }
}
```