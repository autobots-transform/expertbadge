import { DomainConfig } from '../types';

const PM_CONFIG: DomainConfig = {
  slug: 'product-management',
  label: 'Product Management',
  description:
    'Assessed on first-principles product thinking across discovery, strategy, metrics, execution, and leadership.',

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

  coreBehaviours: [
    {
      id: 'problem-before-solution',
      label: 'Problem before solution',
      description:
        'Starts with deeply understanding the problem space before proposing or committing to solutions',
      signals: [
        'asks what problem we are solving before discussing what to build',
        'talks to customers or uses customer data before scoping solutions',
        'can articulate the problem in customer terms without referencing a feature',
        'validates the problem exists at meaningful scale before investing',
      ],
      antiSignals: [
        'jumps immediately to what to build',
        'accepts feature requests at face value without questioning the underlying problem',
        'prioritises by effort or stakeholder urgency rather than problem severity',
      ],
    },
    {
      id: 'outcome-over-output',
      label: 'Outcome over output',
      description:
        'Frames success as business and customer outcomes, not features shipped or tasks completed',
      signals: [
        'defines success metrics before discussing scope',
        'pushes back on feature requests by asking what outcome they serve',
        'measures results by customer or business impact, not delivery velocity',
        'willing to descope or kill a feature if the outcome can be achieved another way',
      ],
      antiSignals: [
        'equates shipping with success',
        'measures progress by story points or features delivered',
        'accepts a roadmap as the goal rather than a means to an outcome',
      ],
    },
    {
      id: 'continuous-customer-evidence',
      label: 'Continuous customer evidence',
      description:
        'Maintains ongoing contact with customers to inform decisions, not just at project start or end',
      signals: [
        'describes a regular cadence of customer contact (not one-time research)',
        'distinguishes between what customers say they want and what they actually do',
        'uses multiple evidence types: qualitative interviews, usage data, support signals',
        'updates priorities when new customer evidence contradicts assumptions',
      ],
      antiSignals: [
        'relies only on customer requests or sales feedback',
        'does research once at the start and ships without further validation',
        'treats customer evidence as optional when stakeholders have strong opinions',
      ],
    },
    {
      id: 'navigate-stakeholder-pressure',
      label: 'Navigate stakeholder pressure without abandoning users',
      description:
        'Handles business and stakeholder demands while maintaining focus on user and product integrity',
      signals: [
        'acknowledges legitimate business urgency without immediately capitulating',
        'reframes stakeholder requests in terms of outcomes to find common ground',
        'proposes alternatives that serve the underlying business need differently',
        'escalates disagreements with data and reasoning, not just position',
      ],
      antiSignals: [
        'accepts every stakeholder request without questioning priority or tradeoffs',
        'avoids conflict by agreeing to everything and then failing to deliver',
        'ignores business context and digs in on user needs alone',
      ],
    },
    {
      id: 'data-informed-decisions',
      label: 'Data-informed decisions',
      description:
        'Uses the right type of data for the decision at hand — neither data-driven to a fault nor flying blind',
      signals: [
        'distinguishes between input metrics (leading) and output metrics (lagging)',
        'knows when qualitative insight is more valuable than quantitative data',
        'defines what data would change their mind before starting an initiative',
        'treats metrics as proxies for outcomes, not outcomes themselves',
      ],
      antiSignals: [
        'waits for statistical significance before making any decision',
        'ignores quantitative data in favour of gut feel or loudest voice',
        'confuses correlation with causation in product metrics',
        'optimises for a metric without asking what behaviour it actually measures',
      ],
    },
  ],

  expertLenses: [
    {
      key: 'MC',
      name: 'Marty Cagan',
      source: 'Inspired (2017), Empowered (2020)',
      behaviourIds: [
        'problem-before-solution',
        'outcome-over-output',
        'navigate-stakeholder-pressure',
      ],
      principle:
        'Empowered teams are given outcomes to achieve and the autonomy to discover solutions — they are not feature factories executing a roadmap handed down from stakeholders.',
    },
    {
      key: 'TT',
      name: 'Teresa Torres',
      source: 'Continuous Discovery Habits (2021)',
      behaviourIds: ['continuous-customer-evidence', 'problem-before-solution'],
      principle:
        'Great PMs maintain a weekly cadence of customer touchpoints and use the Opportunity Solution Tree to systematically separate the opportunity space from the solution space before jumping to build.',
    },
    {
      key: 'SD',
      name: 'Shreyas Doshi',
      source: "First Round Review, Lenny's Podcast (documented frameworks)",
      behaviourIds: [
        'data-informed-decisions',
        'outcome-over-output',
        'navigate-stakeholder-pressure',
      ],
      principle:
        'High-leverage PMs distinguish input metrics from output metrics, apply LNO thinking to direct effort toward what actually moves outcomes, and influence without authority by making the business case in terms stakeholders care about.',
    },
  ],

  questions: [
    {
      id: 1,
      domain: 'Discovery',
      text: 'How do you decide what to build next? Walk me through your process for prioritising problems to solve.',
    },
    {
      id: 2,
      domain: 'Strategy',
      text: "A VP of Sales brings you a well-researched feature request backed by customer data. It's time-sensitive — a key prospect flagged it as a deal blocker. What do you do?",
    },
    {
      id: 3,
      domain: 'Metrics',
      text: "Your product's DAU is declining. How do you diagnose what's wrong and what do you prioritise first?",
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
};

export default PM_CONFIG;
