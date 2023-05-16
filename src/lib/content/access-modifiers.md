---
title: Access Control
language: en
lessonVideoUrl: https://www.youtube.com/embed/ly3rNs0xCRQ
---

<script>
  import Tip from '$lib/components/atoms/Tip.svelte';
  import ProCon from '$lib/components/atoms/ProCon.svelte';   
  import LessonVideo from '$lib/components/atoms/LessonVideo.svelte';   
</script>

# Access Modifiers

<LessonVideo {lessonVideoUrl} />

This part extends a previous discussion had in <a href="/access-control">Access Control</a>.

When we look at a function or variable like:

```cadence
pub fun test() {

}

pub let greeting: String
```

`pub` is something called an "Access Modifier" in Cadence. An Access Modifier denotes where a function can be called, or where a variable can be read/mutated. But there are a bunch of others we can use as well. Let's take a look at this diagram to help give us an idea of all the different access modifiers we can use.

<img src="/content/access_modifiers.png" />

We are only going to focus on the `var` rows, because `let` does not have a write scope since it is a constant. I really encourage you to watch the video before reading over this next section.

## What does "Scope" mean?

Scope is the area in which you can access, modify, or call your "things" (variables, constants, fields, or functions). There are 4 types of scope:

### 1. All Scope

This means we can access our thing from **anywhere**. Inside the contract, in transactions and scripts, wherever.

<img src="/content/allscope.PNG" />

### 2. Current & Inner Scope

This means we can only access our thing from where it is defined and inside of that.

<img src="/content/currentandinner.PNG" />

### 3. Containing Contract Scope

This means we can access our thing anywhere inside the contract that it is defined.

<img src="/content/contractscope.PNG" />

### 4. Account Scope

<img src="/content/accountscope.PNG" />

This means we can access our thing anywhere inside the account that it is defined. This means all of the contracts that are in the account. Remember: we can deploy multiple contracts to one account.

## Back to Access Modifiers

Let's walk through all of the access modifiers given our now understanding of scope...

### pub(set)

`pub(set)` only applies to variables, constants, and fields. Functions **cannot** be publically settable. It is also the most dangerous and easily accessible modifier.

Ex.

```cadence
pub(set) var x: String
```

Write Scope - **All Scope**

Read Scope - **All Scope**

### pub/access(all)

`pub` is the same thing as `access(all)`. This is the next layer down from pub(set).

Ex.

```cadence
pub var x: String
access(all) var y: String

pub fun testFuncOne() {}
access(all) fun testFuncTwo() {}
```

Write Scope - Current & Inner

Read Scope - **All Scope**

### access(account)

`access(account)` is a little more restrictive than `pub` due to its read scope.

Ex.

```cadence
access(account) var x: String

access(account) fun testFunc() {}
```

Write Scope - Current & Inner

Read Scope - All Contracts in the Account

### access(contract)

`access(contract)` is a little more restrictive than `access(account)` due to its read scope.

Ex.

```cadence
access(contract) var x: String

access(contract) fun testFunc() {}
```

Write Scope - Current & Inner

Read Scope - Containing Contract

### priv/access(self)

`priv` is the same thing as `access(self)`. This is the most restrictive (and safe) access modifier.

Ex.

```cadence
priv var x: String
access(self) var y: String

priv fun testFuncOne() {}
access(self) fun testFuncTwo() {}
```

Write Scope - Current & Inner

Read Scope - Current & Inner

## Very Important Notes

<img src="/courses/beginner-cadence/pleasenote.jpeg" />

After looking at our access modifiers, we must make an extremely important distinction: **Even though some access modifiers like `priv` make fields unreadable in your Cadence code, this does not mean people cannot read this info by looking at the blockchain. _Everything on the blockchain is public_, regardless of its read scope.** Access modifiers simply let you determine what is readable/writeable in the context of your Cadence code. Never store private information on the blockchain!