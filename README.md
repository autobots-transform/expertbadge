# ExpertBadge

**Know your expertise. Earn it.**

ExpertBadge assesses professional judgment through adaptive questioning, then benchmarks
every answer against documented expert behaviours. You walk away with an honest, tiered
badge — and the specific gaps to close next.

## Philosophy: behaviour first

ExpertBadge scores **what you do, not what you've read.** The core rules the scoring
engine enforces:

- **Behaviour over vocabulary.** Plain language and formal framework terminology score
  identically when the underlying thinking is sound. "I talk to customers every week before
  deciding" scores the same as "I run continuous discovery with weekly touchpoints."
- **Expert frameworks are lenses, not the benchmark.** Documented experts are referenced to
  *illustrate* behaviours great practitioners already demonstrate — they are never the source
  of truth, and vocabulary alone is never rewarded.
- **No fabricated scores.** When an answer is too brief to assess fairly, the app asks a
  neutral follow-up (the clarification round) rather than guessing.

## Live domains

| Domain | Assessed on |
|---|---|
| **Technical Program Management** | Clarity from ambiguity, dependency sequencing, risk, calibrated status, driving outcomes across teams you don't control |
| **Product Management** | Problem-before-solution, outcome over output, continuous customer evidence, stakeholder navigation, data-informed decisions |

Adding a domain is a config-only change — see [`lib/domains/DOMAIN_AUTHORING.md`](lib/domains/DOMAIN_AUTHORING.md).

## How it works

1. Pick a domain and answer a set of realistic scenario questions.
2. For each answer, `/api/clarify` decides whether a neutral follow-up would surface deeper
   knowledge you didn't fully express.
3. `/api/evaluate` scores the answer on three dimensions (0–100): **accuracy** (did you
   demonstrate the core behaviours?), **nuance** (did you surface real-world tradeoffs and
   failure modes?), and **vocab** (clarity of articulation). It returns per-expert views,
   coaching, and a domain rating.
4. The overall score (average of the three) maps to a badge tier:

   | Tier | Overall score |
   |---|---|
   | 🏆 Expert | ≥ 80 |
   | 🎓 Proficient | ≥ 62 |
   | 📚 Practicing | ≥ 42 |
   | 🌱 Aspiring | < 42 |

## Architecture

```
app/
  page.tsx                  Landing — domain picker
  assess/[domain]/page.tsx  Assessment flow (questions + clarification round)
  results/page.tsx          Badge + score breakdown
  api/clarify/route.ts      Decides if a follow-up question is warranted
  api/evaluate/route.ts     Scores an answer → EvaluationResult
lib/
  domains/*.ts              One config per domain (behaviours, expert lenses, questions)
  domains/index.ts          Domain registry
  domains/DOMAIN_AUTHORING.md  Guide for adding a domain
  scoring-prompt.ts         Shared system/user prompt builder (owns all prompt logic)
  scoring.ts                Badge tiering + tier metadata
  types.ts                  Shared types
  supabase.ts               Optional badge persistence (no-op if unconfigured)
supabase/migrations/        Database schema
```

The scoring engine is shared: a domain supplies only its behaviours, expert lenses, and
questions — `lib/scoring-prompt.ts` builds the prompt, and the API routes own the model call.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS v4**, TypeScript
- **Anthropic SDK** — both API routes run on **`claude-opus-4-8`** (the `evaluate` route uses
  adaptive thinking for nuanced scoring)
- **Supabase** — optional badge persistence; the assessment flow works fully without it

## Getting started

> ⚠️ **Use Node 22 LTS.** Node 25 causes the Next.js dev server's API routes to hang on
> outbound requests (a `fetch`-patching incompatibility). The repo pins the version in
> `.nvmrc`.

```bash
# Node 22 (via a version manager)
nvm use            # reads .nvmrc

# ...or, with a keg-only Homebrew install and no version manager:
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-...        # required — scoring calls
# Optional — badge persistence; omit to run without a database:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## For coding agents

Any coding agent is free to use whatever tools it needs to build and work on this project.
Before writing code, note that this project runs a **modified build of Next.js** — read the
relevant guide in `node_modules/next/dist/docs/` (and `AGENTS.md`) before relying on
framework behaviour from memory.
