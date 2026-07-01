import { DomainConfig, Question } from '../types';

const SYSTEM_PROMPT = `You are a strict PM expert assessor. Benchmark answers ONLY against documented frameworks:

- Marty Cagan (SVPG): Empowered vs feature teams, outcome over output, product discovery before delivery,
  coaching teams to solve problems rather than shipping roadmaps. Source: Inspired (2017), Empowered (2020).
- Teresa Torres: Continuous discovery, opportunity solution trees, assumption testing, weekly customer
  touchpoints, separating opportunity from solution space. Source: Continuous Discovery Habits (2021).
- Shreyas Doshi: LNO (Leverage/Neutral/Overhead) framework, influence without authority, high-agency
  thinking, input vs output metrics distinction.
  Source: Lenny's Podcast, First Round Review, public documented threads.

STRICT RULES:
1. Never invent expert positions. Only reference what is documented in the sources above.
2. If the answer is too vague or off-topic to score meaningfully, set answer_flagged = true.
3. Score what was actually demonstrated across the full turn (original answer + any
   clarification), not just the first response in isolation.
4. Partial credit is expected — most practitioners have genuine gaps.
5. Respond ONLY with valid JSON. No markdown fences, no preamble, no trailing text.
6. Credit mental model and intent, not just framework vocabulary. A user who describes
   the right behaviour (e.g. "go to customer service to understand real user pain before
   deciding what to build") is demonstrating outcome-oriented discovery thinking even if
   they do not use Torres's exact terminology. Do not penalise for informal language
   when the underlying reasoning is sound. Vocabulary score reflects correct USE of
   PM terms — not whether the user quoted a book title.`;

function buildUserPrompt(
  question: Question,
  answer: string,
  clarificationResponse?: string
): string {
  const clarificationBlock = clarificationResponse
    ? `\nClarification response (user's follow-up answer): ${clarificationResponse}
NOTE: Score the original answer AND clarification response together as one unified response.
If the clarification reveals stronger understanding than the original answer alone suggested,
score the stronger understanding — the clarification is not a penalty, it is signal.`
    : '';

  return `Sub-domain: ${question.domain}
Question: ${question.text}${question.context ? `\nContext given: ${question.context}` : ''}
User answer: ${answer}${clarificationBlock}

Return this JSON shape exactly:
{
  "scores": {
    "accuracy": <integer 0-100>,
    "nuance": <integer 0-100>,
    "vocab": <integer 0-100>
  },
  "expert_views": [
    {
      "expert": "Marty Cagan",
      "key": "MC",
      "position": "<one sentence paraphrase of Cagan's documented stance, cite source>",
      "gap": "<what the user missed or nailed — reference both answers if clarification was given>"
    },
    {
      "expert": "Teresa Torres",
      "key": "TT",
      "position": "<one sentence from CDH, cite source>",
      "gap": "<specific gap or confirmation>"
    },
    {
      "expert": "Shreyas Doshi",
      "key": "SD",
      "position": "<one sentence from documented source>",
      "gap": "<specific gap or confirmation>"
    }
  ],
  "coaching": "<2-3 sentence coaching note: what to study, why it matters, specific resource>",
  "domain_rating": "<strong|partial|gap>",
  "answer_flagged": <true only if the combined response is still too vague to score, otherwise false>
}`;
}

const PM_CONFIG: DomainConfig = {
  slug: 'product-management',
  label: 'Product Management',
  description:
    'Assessed against Cagan, Torres & Doshi frameworks across discovery, strategy, metrics, execution, and leadership.',
  experts: [
    {
      key: 'MC',
      name: 'Marty Cagan',
      description: 'SVPG — empowered teams, outcome over output',
      avatarColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      key: 'TT',
      name: 'Teresa Torres',
      description: 'Continuous discovery, opportunity solution trees',
      avatarColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
    {
      key: 'SD',
      name: 'Shreyas Doshi',
      description: 'LNO framework, influence & judgment at scale',
      avatarColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
  ],
  questions: [
    {
      id: 1,
      domain: 'Discovery',
      text: 'How do you decide what to build next? Walk me through your process for prioritizing problems to solve.',
    },
    {
      id: 2,
      domain: 'Strategy',
      text: "A VP of Sales brings you a well-researched feature request backed by customer data. It's time-sensitive — a key prospect flagged it as a deal blocker. What do you do?",
    },
    {
      id: 3,
      domain: 'Metrics',
      text: "Your product's DAU is declining. How do you diagnose what's wrong and what do you prioritize first?",
    },
    {
      id: 4,
      domain: 'Execution',
      text: 'Engineering estimates a requested feature will take 3 months. Business leadership needs it in 6 weeks. How do you handle this?',
    },
    {
      id: 5,
      domain: 'Leadership',
      text: 'You genuinely disagree with a product direction decision made by your VP. What do you do?',
    },
  ],
  systemPrompt: SYSTEM_PROMPT,
  userPromptBuilder: buildUserPrompt,
};

export default PM_CONFIG;
