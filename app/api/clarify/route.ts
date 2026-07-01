import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDomain } from '@/lib/domains';
import { ClarifyResult } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CLARIFY_SYSTEM = `You are a fair expert assessor deciding whether a follow-up question
would meaningfully reveal deeper knowledge the user has but did not fully express.

RULES:
1. Ask a clarifying question ONLY if the answer is genuinely ambiguous or abbreviated in a way
   that could hide real expertise. Do not ask if the answer is clearly complete or clearly shallow.
2. The clarifying question must probe the user's mental model — not hint toward the correct answer.
   It should ask HOW or WHY, not lead them toward a framework they haven't mentioned.
3. One question only. Focused. Neutral tone.
4. If the answer is too vague/off-topic to even clarify usefully, set needs_clarification: false
   (the evaluate route will flag it instead).
5. Respond ONLY with valid JSON. No markdown, no preamble.`;

export async function POST(req: NextRequest) {
  try {
    const { domainSlug, questionId, answer } = await req.json();

    if (!domainSlug || !questionId || !answer) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const domain = getDomain(domainSlug);
    const question = domain?.questions.find((q) => q.id === questionId);
    if (!domain || !question) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const prompt = `Sub-domain: ${question.domain}
Question asked: ${question.text}
User's answer: ${answer}

Decide whether a clarifying question would surface meaningfully deeper knowledge.
Return exactly:
{
  "needs_clarification": <true|false>,
  "clarifying_question": "<one focused follow-up question, or null if needs_clarification is false>"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: CLARIFY_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const result: ClarifyResult = JSON.parse(
      raw.replace(/```json|```/g, '').trim()
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Clarify error:', error);
    // On error, fail open — skip clarification rather than blocking the user
    return NextResponse.json({
      needs_clarification: false,
      clarifying_question: null,
    });
  }
}
