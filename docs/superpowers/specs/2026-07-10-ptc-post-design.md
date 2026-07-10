# Design: PTC post (follow-up to "ePBS Changes How Ethereum Scales")

Date: 2026-07-10. Status: pending user review.

## Goal

Pay off post 1's teaser: how ePBS resolves payload ambiguity via the PTC,
then stress-test the mechanism with failure modes.

## Constraints

- Prose only, no images. ~1,000–1,200 words.
- Same voice, frontmatter, and layout as post 1. New dir
  `src/pages/writing/<slug>/index.md`.
- Every spec-level detail verified against consensus-specs Gloas at draft
  time. Nothing from memory.

## Title

**How ePBS Resolves Payload Ambiguity**

## Structure

1. **Cold open.** 2–3 sentences: validators can agree on the beacon block yet
   disagree on the payload. Link post 1. No slot-anatomy recap.

2. **Why not let slot n+1 sort it out.** The deadline needs no committee —
   n+1 attesters can enforce it locally, like proposer timeliness today. PTC
   adds one thing: an in-slot broadcast of the verdict. Losing it costs:
   - Honest n+1 proposer flies blind: slot-n attestations predate the
     reveal, so no aggregate exists; wrong pick → orphaned.
   - Malicious n+1 proposer becomes the unchecked judge: boost makes its
     choice the coordination point, so a builder need only game one node's
     view, not a committee majority.
   - Payload status unresolved until n+1 arrives: a full slot of
     confirmation uncertainty.
   Don't claim n+1 attesters fragment — boost coordinates them, except when
   n+1 is late or missing.

3. **The mechanism.** Small committee sampled from slot-n validators votes at
   the payload deadline: did payload and blobs arrive on time → full or
   empty. Key move: block fate decoupled from payload fate; a slot survives
   as (block, empty) instead of reorging. One-liner: signed votes leave an
   attributable record.

4. **Who it protects.** Honest proposer: block survives a withholding
   builder. Honest builder: payment conditionality — verify against Gloas.
   Fork choice trusts the verdict, not local arrival.

5. **Failure modes** (each a question):
   - Builder withholds → slot goes empty; payment consequence per spec.
   - Boundary reveal → views split full/empty; how fork choice converges.
   - PTC splits or equivocates; is a small committee bribable.
   - Proposer self-builds; does anything above break.

6. **Close.** Using more of the slot only works if someone keeps time; the
   PTC is the timekeeper. No third-post teaser.

## Out of scope

Other Glamsterdam EIPs. MEV/market-structure framing. Any visuals.

## Success criteria

- Post-1 readers get the promised answer without rereading.
- Casual reader can stop after §4 with a complete model.
- No claims contradicting Gloas specs.
