import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDomain } from '@/lib/domains';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/scoring-prompt';
import { EvaluationResult } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { domainSlug, questionId, answer, clarificationResponse } =
      await req.json();

    if (!domainSlug || !questionId || !answer || answer.trim().length < 20) {
      return NextResponse.json(
        { error: 'Missing or too-short answer' },
        { status: 400 }
      );
    }

    const domain = getDomain(domainSlug);
    if (!domain) {
      return NextResponse.json({ error: 'Unknown domain' }, { status: 404 });
    }

    const question = domain.questions.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Unknown question' }, { status: 404 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: buildSystemPrompt(domain),
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(
            domain,
            question,
            answer.trim(),
            clarificationResponse?.trim()
          ),
        },
      ],
    });

    const rawText = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const result: EvaluationResult = JSON.parse(
      rawText.replace(/```json|```/g, '').trim()
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Evaluate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Evaluation failed' },
      { status: 500 }
    );
  }
}
