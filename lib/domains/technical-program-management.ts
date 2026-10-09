import { DomainConfig } from '../types';

const TPM_CONFIG: DomainConfig = {
  slug: 'technical-program-management',
  label: 'Technical Program Management',
  description:
    'Assessed on first-principles program leadership across planning, dependencies, risk, communication, and driving outcomes across teams you do not control.',

  experts: [
    {
      key: 'FB',
      name: 'Frederick Brooks',
      description: 'Mythical Man-Month — coordination cost & schedule realism',
      avatarColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      key: 'DL',
      name: 'DeMarco & Lister',
      description: 'Waltzing with Bears — risk as the core discipline',
      avatarColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
    {
      key: 'WL',
      name: 'Will Larson',
      description: 'An Elegant Puzzle — leading cross-org migrations',
      avatarColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
  ],

  coreBehaviours: [
    {
      id: 'clarity-from-ambiguity',
      label: 'Drives clarity from ambiguity',
      description:
        'Turns a vague, cross-team mandate into a concrete plan with named owners, milestones, and decision points',
      signals: [
        'converts a fuzzy goal into a specific definition of done before mobilising teams',
        'names a single owner for every workstream rather than leaving work collectively owned',
        'forces open questions to explicit decisions with a date, rather than letting them drift',
        'writes down assumptions and scope boundaries so teams are not guessing',
      ],
      antiSignals: [
        'starts scheduling meetings before the goal or success criteria are defined',
        'leaves ownership ambiguous and hopes teams self-organise',
        'tracks activity like meetings held and docs written instead of decisions made and milestones hit',
      ],
    },
    {
      id: 'map-sequence-dependencies',
      label: 'Maps and sequences dependencies',
      description:
        'Identifies the critical path across teams and orders work so teams are not blocked waiting on each other',
      signals: [
        'maps which team needs what from which other team before work starts',
        'identifies the longest dependency chain and protects it as the critical path',
        'resolves a dependency that would bite in month three while there is still time in month one',
        'sequences work so a blocked team can make progress elsewhere instead of idling',
      ],
      antiSignals: [
        'treats all workstreams as independent and is surprised when one blocks another',
        'discovers critical dependencies only when a team is already blocked',
        'escalates a dependency conflict without a proposed sequence to resolve it',
      ],
    },
    {
      id: 'proactive-risk-management',
      label: 'Manages risk before it becomes a fire',
      description:
        'Surfaces real risks early, drives mitigation, and distinguishes genuine threats from background noise',
      signals: [
        'names the two or three things most likely to sink the program and tracks them actively',
        'drives a mitigation or contingency for each real risk rather than just logging it',
        'raises a credible risk early even when the current status looks healthy',
        'distinguishes a real program-threatening risk from routine uncertainty',
      ],
      antiSignals: [
        'only reports risks once they have already become blockers',
        'maintains a risk list that no one acts on',
        'treats every uncertainty as a crisis, so the real risks get lost in the noise',
        'assumes the plan will hold and has no contingency when it does not',
      ],
    },
    {
      id: 'calibrated-status-escalation',
      label: 'Communicates honest, calibrated status',
      description:
        'Reports status truthfully at the right altitude for each audience and escalates with a recommendation, not just a problem',
      signals: [
        'gives an exec the one decision that matters and a team the specific blocker',
        'calls a program yellow or red honestly rather than reporting green over known trouble',
        'escalates with a recommended path and the tradeoff, not just that the team is blocked',
        'ties status to the outcome and the date, not to how busy the teams are',
      ],
      antiSignals: [
        'reports green on the outside while the program is red on the inside',
        'escalates problems without a proposed resolution',
        'gives every audience the same undifferentiated status dump',
        'softens bad news until it is too late to act on',
      ],
    },
    {
      id: 'influence-without-authority',
      label: 'Drives accountability without authority',
      description:
        'Gets teams they do not manage to deliver, through trust, framing, and making the right thing the easy thing',
      signals: [
        'gets commitment from a team they have no authority over by connecting the work to what that team cares about',
        'builds enough trust that teams flag their own slips early rather than hiding them',
        'makes the needed action the path of least resistance rather than relying on mandate',
        'holds a peer team accountable to a commitment without needing to pull rank',
      ],
      antiSignals: [
        'reaches for executive mandate or escalation as the first tool rather than the last',
        'assumes a commitment made in a meeting will hold without follow-through',
        'confuses sending reminders with driving accountability',
        'gives up on a dependency the moment a team deprioritises it',
      ],
    },
  ],

  expertLenses: [
    {
      key: 'FB',
      name: 'Frederick P. Brooks Jr.',
      source: 'The Mythical Man-Month (1975, rev. 1995)',
      behaviourIds: ['map-sequence-dependencies', 'calibrated-status-escalation'],
      principle:
        'Coordination and communication cost grows faster than team size, and adding people to a late program makes it later — so delivery is governed by how work is sequenced and how honestly the schedule is held, not by raw effort.',
    },
    {
      key: 'DL',
      name: 'Tom DeMarco & Timothy Lister',
      source: 'Waltzing with Bears: Managing Risk on Software Projects (2003)',
      behaviourIds: ['proactive-risk-management', 'calibrated-status-escalation'],
      principle:
        'Running a program is managing its risks: name and quantify the things most likely to go wrong up front, keep an active risk list with real mitigations, and stay honest that a program worth doing is one that carries real risk.',
    },
    {
      key: 'WL',
      name: 'Will Larson',
      source: 'An Elegant Puzzle (2019), lethain.com',
      behaviourIds: [
        'clarity-from-ambiguity',
        'map-sequence-dependencies',
        'influence-without-authority',
      ],
      principle:
        'Large cross-team programs and migrations get finished by defining a crisp finish line, sequencing the work so dependencies resolve in order, and making the correct path the easy path for teams you do not control.',
    },
  ],

  questions: [
    {
      id: 1,
      domain: 'Planning',
      text: "Leadership hands you a mandate: 'migrate the company onto the new identity platform by end of year.' Eight teams are involved and nothing else is defined. What are your first moves?",
    },
    {
      id: 2,
      domain: 'Dependencies',
      text: 'Two teams on your program have both stalled — each believes the other owes them an API first. How do you unblock this, and how do you stop it happening again?',
    },
    {
      id: 3,
      domain: 'Risk',
      text: 'Your program is tracking green, but you have a quiet worry that one vendor integration could slip badly. What do you do with that worry?',
    },
    {
      id: 4,
      domain: 'Communication',
      text: 'A team that owns a critical-path component is two weeks behind, and the dependency chain means your launch date is now at risk. How do you communicate this, and to whom?',
    },
    {
      id: 5,
      domain: 'Influence',
      text: "An engineering manager whose team you depend on keeps deprioritising your program's work in favour of their own roadmap. You have no authority over them. What do you do?",
    },
  ],
};

export default TPM_CONFIG;
