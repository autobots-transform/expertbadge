# How to add a new domain to ExpertBadge

## The non-negotiable philosophy

ExpertBadge assesses expertise through behaviours and outcomes — not book knowledge,
not terminology familiarity, not framework vocabulary.

Before you write a single line of config, answer this question:
**What would a world-class practitioner in this domain DO differently from an average one?**
Not what would they READ. Not what terms would they USE. What would they actually DO?

Those behaviours are your benchmark. Expert frameworks are examples of people who
named and documented those behaviours — they are not the source of truth.

## Step 1: Define CoreBehaviours

Write 4-6 behaviours that define expertise in your domain. For each:

- `label`: Short plain-English name (not a framework term)
- `description`: What this behaviour looks like in practice
- `signals`: 3-5 concrete things a person says or does that demonstrate this behaviour.
  Write these in plain language — "talks to customers before deciding" not "runs CDH-style discovery"
- `antiSignals`: 3-5 concrete things that indicate this behaviour is absent

### Good behaviour example (Engineering Leadership)

```ts
{
  id: 'protect-team-from-noise',
  label: 'Shields team from unfiltered noise',
  description: 'Filters and contextualises organisational pressure before it reaches the team, so engineers can focus',
  signals: [
    'takes stakeholder meetings so engineers do not have to',
    'translates business urgency into prioritised technical work rather than passing panic downstream',
    'pushes back on scope changes mid-sprint rather than accepting them silently',
  ],
  antiSignals: [
    'relays every stakeholder request directly to the team without filtering',
    'lets urgent Slack messages from leadership interrupt focused work blocks',
  ],
}
```

### Bad behaviour example (do not do this)

```ts
{
  // WRONG — this is a framework term, not a behaviour
  id: 'lno-thinking',
  label: 'Applies LNO framework',
  description: 'Uses Leverage/Neutral/Overhead classification...',
}
```

## Step 2: Define ExpertLenses

Choose 2-4 practitioners whose documented work illustrates your core behaviours.
They do not need to be book authors — documented blog posts, talks, and interviews
with clear attribution are acceptable.

Rules:
- Only reference documented positions. Never invent.
- The `principle` field must describe a BEHAVIOUR the expert articulates,
  not a term they coined.
- `behaviourIds` must reference IDs from your coreBehaviours array.

## Step 3: Write questions

Questions should:
- Put the user in a realistic situation (not "define continuous discovery")
- Have no single correct answer — good practitioners approach them differently
- Be answerable by an expert in plain language without needing any book knowledge
- Span the range of your coreBehaviours across the question set

## Step 4: Register in `lib/domains/index.ts`

Add your config to the DOMAINS map. The shared scoring engine handles everything else.

## What NOT to do

- Do not write a `systemPrompt` or `userPromptBuilder` — the shared engine in `lib/scoring-prompt.ts` owns this
- Do not define behaviours using framework terminology
- Do not choose experts because they are famous — choose them because their documented
  work clearly illustrates a behaviour your coreBehaviours define
- Do not add more than 6 coreBehaviours — assessment quality degrades with too many dimensions
