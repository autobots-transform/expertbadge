export type DomainRating = 'strong' | 'partial' | 'gap';
export type BadgeTier = 'expert' | 'proficient' | 'practicing' | 'aspiring';

export interface Question {
  id: number;
  domain: string;        // sub-domain label e.g. "Discovery"
  text: string;
  context?: string;      // optional situational context shown below the question
}

export interface Expert {
  key: string;           // e.g. "MC"
  name: string;
  description: string;
  avatarColor: string;   // tailwind bg class
  textColor: string;
}

export interface DomainConfig {
  slug: string;
  label: string;
  description: string;
  experts: Expert[];
  questions: Question[];
  systemPrompt: string;
  userPromptBuilder: (
    question: Question,
    answer: string,
    clarificationResponse?: string
  ) => string;
}

export interface QuestionScores {
  accuracy: number;   // 0-100
  nuance: number;
  vocab: number;
}

export interface ExpertView {
  expert: string;
  key: string;
  position: string;   // paraphrase of documented expert stance
  gap: string;        // what user missed or nailed
}

export interface EvaluationResult {
  scores: QuestionScores;
  expert_views: ExpertView[];
  coaching: string;
  domain_rating: DomainRating;
  answer_flagged: boolean;
}

// NEW — returned by /api/clarify
export interface ClarifyResult {
  needs_clarification: boolean;
  clarifying_question: string | null;  // null when needs_clarification is false
}

// NEW — tracks per-question turn state
export interface QuestionTurn {
  questionId: number;
  answer: string;
  clarifyingQuestion?: string;         // the question Claude asked
  clarificationResponse?: string;      // user's response to it
  skippedClarification?: boolean;      // user chose "Skip, score as-is"
}

export interface AssessmentState {
  currentQ: number;
  turns: QuestionTurn[];               // replaces raw answers[] — full turn record
  scores: QuestionScores[];
  domainRatings: { domain: string; rating: DomainRating }[];
  totals: { accuracy: number; nuance: number; vocab: number };
}

export interface BadgeResult {
  tier: BadgeTier;
  overallScore: number;
  avgAccuracy: number;
  avgNuance: number;
  avgVocab: number;
  domainRatings: { domain: string; rating: DomainRating }[];
  assessedAt: string;
  domain: string;
}
