---
layout: ../../../layouts/Post.astro
title: Things That Help Shorter Slots
date: "2026-09-16"
description: Bigger blocks, more blobs, and shorter slots compete for the same resources. A look at the technical primitives that could save time before protocol deadlines.
---

Thanks to Barnabé Monnot for the review.

We want bigger blocks and more blobs for scaling, and shorter slots for better UX. Bigger blocks and more blobs increase the time nodes are working between blocks. Shorter slots require them to finish that work faster. These goals compete for some of the same resources. With some nuances, beacon block broadcast and proof aggregation are fixed costs per slot, while blob throughput and extra proving work scale with the amount of data and execution.

If slower nodes cannot keep up, shorter slots can increase centralization pressure. This post looks at technical primitives that could help shorter slots. How Ethereum should divide those gains between larger blocks, more blobs, and shorter slots is a separate question.

Broadly, these technical primitives are:

- Broadcast faster.
- Make nodes do less work.
- Pipeline broadcast, state preparation, and execution.
- Reduce the validator work on the critical path.

Faster broadcast gives nodes more time to process blocks. Chunking and improvements to gossip protocols can improve the broadcast of large payloads. [EIP-8411: Fast Execution Payload Broadcast](https://github.com/ethereum/EIPs/pull/12299) proposes splitting the payload into chunks that nodes can forward as they arrive. Later on, erasure coding could extend this approach by allowing receivers to reconstruct the payload from a subset of those chunks, reducing dependence on particular missing chunks or slow peers.

We can go a step further and overlap stream / broadcast with execution. A client could start executing the first chunk while later chunks are still downloading. To do this, it needs the chunk and the chunk access lists required to validate it. [EIP-8101: Payload Chunking](https://eips.ethereum.org/EIPS/eip-8101) proposes dividing the execution payload into chunks that keep each transaction intact, with a separate chunk access list for each chunk. The gain comes from pipelining payload download and execution.

Another approach is to give execution clients "what to process" earlier. A block access list contains all the accounts and storage slots touched during execution, together with their state changes. If the block access list arrives before the execution payload, a client could prefetch the required state from disk and begin computing the proposed post-state root. [EIP-8146: Block Access List Sidecars](https://eips.ethereum.org/EIPS/eip-8146) proposes this separation. Applying [EIP-8411](https://github.com/ethereum/EIPs/pull/12299) to block access list sidecars is another good direction to explore.

Attestations (validator votes) also need to be broadcasted and aggregated before their deadlines. Two EIPs look into this:

- [EIP-8334: Bundled Attestation Propagation](https://github.com/ethereum/EIPs/pull/11905) sends shared attestation data once while retaining individual signatures.
- [EIP-8243: Batching Attestations at Source](https://eips.ethereum.org/EIPS/eip-8243) lets operators aggregate attestations from validators in the same committee, including their signatures, before broadcast.

Both reduce broadcast overhead, though through different mechanisms. Their usefulness for shorter slots depends on whether the savings outweigh any additional batching and verification delay.

Source batching is an optional optimization, so the baseline protocol must remain viable when operators do not use it. A stronger way to reduce worst-case validator work is to reduce the number of validators whose work must fit on the critical path.

[EIP-7251: Increase the MAX_EFFECTIVE_BALANCE](https://eips.ethereum.org/EIPS/eip-7251) allows validators to consolidate their own stake, which reduces the number of attestations that the network sees. This is very beneficial to the network, but it is opt-in and does not bound worst case work. An attester cap would provide that hard bound by limiting the number of validators whose attestations the protocol must process.

[Decoupled consensus](https://consensus.ethereum.foundation/blog/upgrading-finality-edition-1) goes further by separating the beacon chain committee that makes the fork-choice per block decision from the larger set of attestations that is aggregated for economic finality. This reduces the amount of validator work on the hot path while still preserving the same security as today. The exact design is still under development, so its latency properties need to be measured rather than assumed.

Tighter deadlines also make worst-case workloads more important. We need to test clients with valid blocks constructed to stress computation, state access, and networking. [EIP-8131: Unified Transaction Content Floor](https://eips.ethereum.org/EIPS/eip-8131) and [EIP-8279: Block Access List Byte Floor](https://eips.ethereum.org/EIPS/eip-8279) charge for transaction content and block access list bytes, bounding how much data a block can contain at a given gas limit.

Finally, execution proofs could let nodes verify correctness without re-executing the payload. A node maintaining execution state could separately apply state changes whose correctness is covered by the verified proof. [EIP-8025: Optional Execution Proofs](https://eips.ethereum.org/EIPS/eip-8025) lets clients start testing execution proofs. Under the current proposal, nodes still re-execute payloads and use proofs as an additional validity signal. Replacing re-execution is a later step. To support shorter slots, proof generation, broadcast, and verification must finish in time.

All of the above primitives could help with shorter slots. The useful measurement is how much time they save before a protocol deadline, across different clients, hardware, and network conditions. More to come!
