# AI Demo Engine for Personalized Outreach

A sample output from an AI workflow that turns a target account's own prospect into a live, branded sales asset - not a generic pitch deck, a working demo of what personalized outreach could look like for them.

*This repo contains one generated sample site, not the underlying engine or pipeline code.*

## What this is

Most B2B outreach shows a prospect a case study or a deck and asks them to imagine the value. This approach skips the imagining: instead of pitching a target account directly, it builds them a real, working example first - a personalized and interactive proposal generated for one of their own prospects, using their business context, their positioning, and a real go-to-market angle.

The pitch isn't "here's what we could build for you." It's "here's what we already built, using your own prospect as the example. Imagine sending something like this to every account on your list."

## Live example

This repo is a real sample built as part of an account-based pitch: generated for a prospect of the target account (Entravision), showing exactly what a personalized proposal/storefront could look like in production.

**Live demo →** https://entravision-site.vercel.app/

## How the source workflow works

*(For context — the process behind this sample, not code included in this repo.)*

1. **Input:** the target account, and one real prospect of theirs to build the example around.
2. **Research:** an AI workflow gathers structured, public information on the company: what they do, their positioning, their market, relevant context. It then identifies an account that could be a prospect for this company.
3. **Strategic interpretation:** that research is turned into an actual research and data-backed proposal, not a generic template filled with their name.
4. **Generation:** research + strategy become a branded microsite: the proposal itself, live and shareable, not a PDF attachment.
5. **Output:** a working asset the target account can point to and say "we could be sending this to every prospect we have." (This repo is that output.)

## Why this approach

Personalization usually stops at the first line of an email. This flips that. The AI isn't personalizing a sentence, it's personalizing the entire offer: the research, the strategy, and the final asset the prospect actually sees. The proposal is the value proposition, not a wrapper around one.

This system fed a broader campaign that generated **100+ warm B2B leads in 30 days** across 5 client verticals.
