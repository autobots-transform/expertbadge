import { DomainConfig, Question } from './types';

export function buildSystemPrompt(domain: DomainConfig): string {
  const behavioursBlock = domain.coreBehaviours
    .map(
      (b) =>
        `- ${b.label}: ${b.description}\n    Signals present: ${b.signals.join('; ')}\n    Signals absent: ${b.antiSignals.join('; ')}`
    )
    .join('\n');

  const lensesBlock = domain.expertLenses
    .map((l) => `- ${l.name} (${l.source}): ${l.principle}`)
    .join('\n');

  return `You assess ${domain.label} expertise based on first-principles behaviours,
not terminology familiarity or book knowledge.

CORE PRINCIPLE: The expert frameworks listed below are illustrative lenses — they describe
and name behaviours that great practitioners already demonstrate. A person who shows the
right behaviour in plain language scores identically to one who uses framework vocabulary.
Never penalise informal language when the underlying reasoning is sound.
Never reward vocabulary use that is not backed by demonstrated behaviour.

BEHAVIOURS THAT DEFINE EXPERTISE IN THIS DOMAIN:
${behavioursBlock}

EXPERT FRAMEWORKS AS ILLUSTRATIVE LENSES (not judges):
${lensesBlock}

SCORING DIMENSIONS:
- Accuracy (0-100): Did the user demonstrate the core behaviours above?
  Score the behaviour, not the words. Plain language = framework language if the
  behaviour is the same. A person who says "I talk to customers every week before
  deciding anything" is demonstrating the same behaviour as someone who says
  "I run continuous discovery with weekly touchpoints."

- Nuance (0-100): Did they surface real-world complexity?
  Tradeoffs, stakeholder tensions, edge cases, failure modes, what they do when
  data is ambiguous or constraints conflict.

- Vocabulary (0-100): Do they use domain terminology correctly?
  This is the ONLY dimension where terminology familiarity is relevant.
  Reward correct use of terms. Never penalise their absence.
  Never reward jargon use that isn't backed by demonstrated understanding.

STRICT RULES:
1. Never invent expert positions. Only reference what is documented in the sources listed.
2. Score the full turn — original answer plus any clarification response together.
3. Credit the intent and mental model, not just vocabulary.
4. If the combined response is too vague to assess any behaviour, set answer_flagged = true.
5. Partial credit is expected — most practitioners have genuine gaps.
6. Respond ONLY with valid JSON. No markdown fences, no preamble, no trailing text.${domain.promptAddendum ? `\n\nDOMAIN-SPECIFIC NOTES:\n${domain.promptAddendum}` : ''}`;
}

export function buildUserPrompt(
  domain: DomainConfig,
  question: Question,
  answer: string,
  clarificationResponse?: string
): string {
  const clarificationBlock = clarificationResponse
    ? `\nClarification response: ${clarificationResponse}
Score the original answer AND clarification together as one unified response.
If the clarification reveals stronger understanding than the original answer suggested,
score the stronger understanding — clarification is signal, not a second attempt.`
    : '';

  return `Sub-domain: ${question.domain}
Question: ${question.text}${question.context ? `\nContext: ${question.context}` : ''}
User answer: ${answer}${clarificationBlock}

Return exactly this JSON:
{
  "scores": {
    "accuracy": <0-100: behaviours demonstrated, not terminology used>,
    "nuance": <0-100: complexity, tradeoffs, edge cases surfaced>,
    "vocab": <0-100: correct use of domain terminology — only dimension where vocab matters>
  },
  "expert_views": [
    ${domain.expertLenses
      .map(
        (l) => `{
      "expert": "${l.name}",
      "key": "${l.key}",
      "principle": "<the first-principles behaviour ${l.name}'s work illustrates — one sentence>",
      "source": "${l.source}",
      "demonstrated": "<yes|partial|no — did the user show this behaviour regardless of vocabulary>",
      "what_you_showed": "<specific evidence from their answer, even if informally expressed — always provide this>",
      "what_to_deepen": "<what mastery adds beyond what they showed, or null if fully demonstrated>"
    }`
      )
      .join(',\n    ')}
  ],
  "coaching": "<2-3 sentences: what behaviour to deepen, why it matters in practice, specific resource if relevant>",
  "domain_rating": "<strong|partial|gap>",
  "answer_flagged": <true only if combined response is too vague to assess any behaviour>
}`;
}
