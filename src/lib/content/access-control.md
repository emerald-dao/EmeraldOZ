---
title: Access Control
language: en
---

<script>
  import Notice from '$lib/components/atoms/Notice.svelte';
</script>

# Access Control

Access control—that is, "who is allowed to do this thing"—is incredibly important in the world of smart contracts. The access control of your contract may govern who can mint tokens, vote on proposals, freeze transfers, and many other things. It is therefore critical to understand how you implement it, lest someone else steals your whole system.

Fortunately, **access control is built directly into the Cadence language using resources, capabilities, and access modifiers.** There is no third party library required to do any of the following.

## Ownership

The most common and basic form of access control is the concept of ownership: there's an account that is the owner of a contract and can do administrative tasks on it. This approach is perfectly reasonable for contracts that have a single administrative user.

You can achieve this by declaring an `Owner' (or any name) resource in your contract and deploying it to the contract's account upon deployment:

```cadence
pub contract MyContract {
  pub fun normalThing() {
    // anyone can call this normalThing()
  }

  pub resource Owner {
    pub fun specialThing() {
      // only an account with this Owner resource
      // can call specialThing()!
    }
  }

  init() {
    self.account.save(<- create Owner(), to: /storage/MyContractOwner)
  }
}
```

The owner of the contract can easily call the 'specialThing' function by borrowing the 'Owner' resource in their account:

```cadence
import MyContract from 0x01

transaction() {
  let OwnerReference: &MyContract.Owner
  prepare(signer: AuthAccount) {
    // borrow a reference to the Owner resource
    let ownerReference: &MyContract.Owner = signer.borrow<&MyContract.Owner>(from: /storage/MyContractOwner)
                        ?? panic("The signer does not have the Owner resource.")
  }

  execute {
    // call the special function
    self.OwnerReference.specialThing()
  }
}
```

Because 'Owner' is a resource, we can transfer ownership simply by tranferring the resource to another account in a transaction:

```cadence
import MyContract from 0x01

transaction() {
  prepare(currentOwner: AuthAccount, newOwner: AuthAccount) {
    // take Owner resource out of `currentOwner`'s storage
    let ownerResource <- currentOwner.load<@MyContract.Owner>(from: /storage/MyContractOwner)
    // deposit Owner resource to `newOwner`'s storage
    newOwner.save(<- ownerResource, to: /storage/MyContractOwner)
  }
}
```

## Resource-Based Access Control

While the simplicity of ownership can be useful for simple systems or quick prototyping, different levels of authorization are often needed. You may want for an account to have permission to ban users from a system, but not create new tokens.

In essence, we will be defining multiple roles each represented as a resource and allowed to perform different sets of actions. An account may store, for example, a 'moderator', 'minter' or 'admin' resource. 

Most software uses access control systems that are role-based: some users are regular users, some may be supervisors or managers, and a few will often have administrative privileges.

<Notice type="pro">
  <ol>
    <li>Very easy to implement.</li>
  </ol>
</Notice>

<Notice type="con">
  <ol>
    <li>Have to coordinate a multi-signed transaction to grant roles.</li>
    <li>Cannot revoke access.</li>
  </ol>
</Notice>

Here's a simple example of using resource-based access control in a Fungible Token to define a 'minter' role, which allows the holder to create new tokens, and a 'burner' role, which allows the holder to burn tokens.

```cadence
import FungibleToken from 0x01

pub contract EmeraldToken: FungibleToken {
  pub resource Owner {
    pub fun createMinter(): @Minter {
      return <- create Minter()
    }

    pub fun createBurner(): @Burner {
      return <- create Burner()
    }
  }

  pub resource Minter {
    pub fun mint() {
      // only an account with this Minter resource
      // can call mint()!
    }
  }

  pub resource Burner {
    pub fun burn() {
      // only an account with this Burner resource
      // can call burn()!
    }
  }

  // ... rest of the FungibleToken standard is not shown here ...

  init() {
    self.account.save(<- create Owner(), to: /storage/EmeraldTokenOwner)
  }
}
```

### Granting Permissions

To give an account the ability to mint, for example, we can multi-sign a transaction (1 being the holder of the Owner resource, and 1 being the account we want to give permission to) to give the new minter the resource to store.

```cadence
import EmeraldToken from 0x01

transaction() {
  prepare(owner: AuthAccount, newMinter: AuthAccount) {
    // borrow a refernece to the Owner resource
    let ownerResource: &EmeraldToken.Owner = owner.borrow<&EmeraldToken.Owner>(from: /storage/EmeraldTokenOwner)
    // create the new Minter resource
    let newMinterResource: @EmeraldToken.Minter <- ownerResource.createMinter()
    // save it to the `newMinter`'s storage
    newMinter.save(<- newMinterResource, to: /storage/EmeraldTokenMinter)
  }
}
```

### Revoking Permissions

The issue with resource-based access control is once an account owns a resource, they have complete control over it. It is not possible to take the resource away from them since loading a resource out of an 'AuthAccount' requires the holder to sign a transaction.

## Capability-Based Access Control

Cadence supports capabilities, which allow an owner of a resource to delegate certain permissions to public and private paths. You can think of capabilities as a key the owner of a resource creates that can be granted to others (publicly/privately) that unlock the underlying resource it points to.

Using private capabilities, we can define a proxy resource that will allow an Owner to grant/revoke access to a resource.

<Notice type="pro">
  <ol>
    <li>Still uses the basic ideas of resource-based access control.</li>
    <li>Allows for easy granting/revoking of resources.</li>
  </ol>
</Notice>

<Notice type="con">
  <ol>
    <li>Have to introduce a third "proxy" resource.</li>
    <li>User must still set up a "proxy" ahead of time.</li>
  </ol>
</Notice>

Here's a similar example from earlier; We define a 'Minter' resource, which allows the holder to create new tokens. 

However this time, instead of creating an 'Owner' resource that creates new Minter resources, we just create 1 Minter resource that the contract deployer account stores, and a 'Proxy' resource that anyone can store. Then, the holder of the 'Minter' can create a private capability to their 'Minter' and deposit it to the 'Proxy' they want to give access to.

```cadence
import FungibleToken from 0x01

pub contract EmeraldToken: FungibleToken {
  pub resource Minter {
    pub fun mint() {
      // only an account with this Minter resource
      // OR a holder of a private capability can 
      // call mint()!
    }
  }

  pub resource interface ProxyPublic {
    // allow anyone to call this function
    // with a valid Minter capability.
    //
    // note it only makes sense for the holder
    // of the Minter resource to call this,
    // but there's no danger for the general
    // public people to because the cap must
    // be valid.
    pub fun fulfillMinterCap(cap: Capability<&Minter>)
  }

  pub resource Proxy: ProxyPublic {
    // Must be `access(self)` or a malicious Proxy
    // could give the capability to someone else
    access(self) let minterCap: Capability<&Minter>?

    pub fun fulFillMinterCap(cap: Capability<&Minter>) {
      assert(cap.check(), message: "The capability is invalid.")
      self.minterCap = cap
    }

    pub fun borrowCap(): &Minter {
      return self.minterCap!.borrow()!
    }

    init() {
      self.minterCap = nil // initialize to nil since we don't have a capability yet
    }
  }

  pub fun createProxy(): @Proxy {
    return <- create Proxy()
  }

  // ... rest of the FungibleToken standard is not shown here ...

  init() {
    self.account.save(<- create Minter(), to: /storage/EmeraldTokenMinter)
  }
}
```

### Granting Permissions

Here is a transaction a potential minter will have to run to store a 'Proxy' in their account. They will also have to create a public capability to their 'Proxy' to allow the 'fulfillMinterCap' function to be called by the original minter:

```cadence
import EmeraldToken from 0x01

transaction() {

  prepare(user: AuthAccount) {
    user.save(<- EmeraldToken.createProxy(), to: /storage/EmeraldTokenProxy)
    // Link the Proxy to the public restricted by `EmeraldToken.ProxyPublic` so the Minter can deposit
    // a capability, but no one will be able to call functions like `borrowCap`
    user.link<&EmeraldToken.Proxy{EmeraldToken.ProxyPublic}>(/public/EmeraldTokenProxy, target: /storage/EmeraldTokenProxy)
  }

  execute {}
}
```

And here is a transaction that the holder of the 'Minter' would run to deposit a private capability to the 'Proxy':

```cadence
import EmeraldToken from 0x01

transaction(newMinter: Address) {
  let PrivateMinterCap: Capability<&EmeraldToken.Minter>
  let PublicProxyRef: &EmeraldToken.Proxy{EmeraldToken.ProxyPublic}

  prepare(minter: AuthAccount) {
    // create a private capability to the Minter resource
    minter.link<&EmeraldToken.Minter>(/private/EmeraldTokenMinter, target: /storage/EmeraldTokenMinter)
    self.PrivateMinterCap = minter.getCapability<&EmeraldToken.Minter>(/private/EmeraldTokenMinter)
    
    self.PublicProxyRef = getAccount(newMinter).getCapability(/public/EmeraldTokenMinter)
                            .borrow<&EmeraldToken.Proxy{EmeraldToken.ProxyPublic}>()
                            ?? panic("The new minter does not have a Proxy set up in their account.")
  }

  execute {
    self.PublicProxyRef.fulfillMinterCap(cap: self.PrivateMinterCap)
  }
}
```

Lastly, here is how the owner of the 'Proxy' would mint assuming they have been fulfilled with a 'Minter' capability.

```cadence
import EmeraldToken from 0x01

transaction() {
  let ProxyRef: &EmeraldToken.Proxy

  prepare(newMinter: AuthAccount) {
    // borrow a reference to the proxy
    self.ProxyRef = newMinter.borrow<&EmeraldToken.Proxy>(from: /storage/EmeraldTokenProxy)
                            ?? panic("The minter does not have a Proxy set up in their account.")
  }

  execute {
    // borrow the capability inside the proxy using the `borrowCap` function
    let minterRef: &EmeraldToken.Minter = self.ProxyRef.borrowCap()
    // now we can mint
    minterRef.mint()
  }
}
```

### Revoking Permissions

Revoking permissions is very easy using capabilities. The holder of the underlying resource (aka the creator of the capability) must unlink the capability.

```cadence
import EmeraldToken from 0x01

transaction(newMinter: Address) {
  let ProxyRef: &EmeraldToken.Proxy

  prepare(minter: AuthAccount) {
    // now all proxys storing this capability will be broken and no longer able to mint
    minter.unlink(/private/EmeraldTokenMinter)
  }

  execute {}
}
```