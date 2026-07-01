export type DomainRating = 'strong' | 'partial' | 'gap';
export type BadgeTier = 'expert' | 'proficient' | 'practicing' | 'aspiring';

export interface Question {
  id: number;
  domain: string;
  text: string;
  context?: string;
}

export interface Expert {
  key: string;
  name: string;
  description: string;
  avatarColor: string;
  textColor: string;
}

export interface CoreBehaviour {
  id: string;
  label: string;
  description: string;
  signals: string[];
  antiSignals: string[];
}

export interface ExpertLens {
  key: string;
  name: string;
  source: string;
  behaviourIds: string[];
  principle: string;
}

export interface DomainConfig {
  slug: string;
  label: string;
  description: string;
  experts: Expert[];
  questions: Question[];
  coreBehaviours: CoreBehaviour[];
  expertLenses: ExpertLens[];
  promptAddendum?: string;
}

export interface QuestionScores {
  accuracy: number;
  nuance: number;
  vocab: number;
}

export interface ExpertView {
  expert: string;
  key: string;
  principle: string;
  source: string;
  demonstrated: 'yes' | 'partial' | 'no';
  what_you_showed: string;
  what_to_deepen: string | null;
}

export interface EvaluationResult {
  scores: QuestionScores;
  expert_views: ExpertView[];
  coaching: string;
  domain_rating: DomainRating;
  answer_flagged: boolean;
}

export interface ClarifyResult {
  needs_clarification: boolean;
  clarifying_question: string | null;
}

export interface QuestionTurn {
  questionId: number;
  answer: string;
  clarifyingQuestion?: string;
  clarificationResponse?: string;
  skippedClarification?: boolean;
}

export interface AssessmentState {
  currentQ: number;
  turns: QuestionTurn[];
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
