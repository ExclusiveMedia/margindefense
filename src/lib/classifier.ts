/**
 * MarginDefense Classification Engine
 * "The Incinerator" - Ruthless CFO Logic
 * 
 * Rule-based classification for MVP. Will be enhanced with LLM in Phase 2.
 */

import type { WorkCategory, BurnReason, ClassificationResult } from '@/types';

// Keywords that indicate BILLABLE work (revenue-generating)
const BILLABLE_KEYWORDS = [
  // Direct client work
  'deliverable', 'delivery', 'milestone', 'final', 'completed',
  'client work', 'client deliverable', 'client presentation',
  // Creative/Production
  'design', 'designing', 'coded', 'coding', 'developed', 'development',
  'wrote', 'writing', 'content', 'copywriting', 'created', 'creating',
  'built', 'building', 'implemented', 'implementation',
  // Strategy (when client-facing)
  'client strategy', 'strategy session with client', 'client call',
  'client meeting', 'presentation to client', 'demo to client',
  // Billable activities
  'billable', 'invoiceable', 'chargeable',
];

// Keywords that indicate MARGIN_BURN (non-billable)
const BURN_KEYWORDS = [
  // Meetings (the #1 margin killer)
  'internal meeting', 'team meeting', 'standup', 'stand-up', 'sync',
  'weekly sync', 'daily standup', 'all-hands', 'retrospective', 'retro',
  'planning meeting', 'brainstorm', 'ideation session',
  // Communication overhead
  'slack', 'email', 'emails', 'responding to', 'replied to',
  'checking messages', 'chat', 'dm', 'direct message',
  // Admin tasks
  'admin', 'administrative', 'paperwork', 'documentation',
  'updating jira', 'jira update', 'ticket update', 'status update',
  'timesheet', 'expense report', 'invoicing', 'billing admin',
  // Internal processes
  'internal', 'internal review', 'peer review', 'code review',
  'internal presentation', 'team presentation',
  // Rework (pure margin destruction)
  'rework', 'redo', 'revision', 'fixing bug', 'bug fix', 'hotfix',
  'debugging', 'troubleshooting', 'investigation',
  // Setup/Overhead
  'setup', 'setting up', 'configuration', 'config', 'onboarding',
  'training', 'learning', 'research', 'researching', 'reading',
  // Waiting/Blocked
  'waiting for', 'blocked by', 'pending', 'on hold',
];

// Keywords that indicate SCOPE_RISK (potential scope creep)
const SCOPE_RISK_KEYWORDS = [
  'quick favor', 'small request', 'can you also', 'while you\'re at it',
  'one more thing', 'additional', 'extra', 'bonus',
  'not in scope', 'out of scope', 'scope change', 'change request',
  'new feature', 'feature request', 'enhancement',
  'urgent request', 'asap', 'rush', 'priority change',
  'client asked for', 'client wants', 'client requested',
];

// Map keywords to burn reasons
const BURN_REASON_PATTERNS: Record<BurnReason, string[]> = {
  scope_creep: ['scope', 'additional', 'extra', 'not in contract', 'new request'],
  internal_meeting: ['meeting', 'sync', 'standup', 'call', 'discussion', 'brainstorm'],
  rework: ['rework', 'redo', 'revision', 'bug', 'fix', 'debug', 'troubleshoot'],
  admin: ['admin', 'jira', 'ticket', 'status', 'timesheet', 'paperwork'],
  communication: ['slack', 'email', 'chat', 'message', 'reply', 'respond'],
  planning: ['planning', 'plan', 'roadmap', 'strategy', 'ideation'],
  research: ['research', 'learning', 'reading', 'study', 'investigation'],
  setup: ['setup', 'config', 'onboarding', 'training', 'installation'],
  other: [],
};

/**
 * Classify a work description using rule-based logic
 */
export function classifyWork(description: string): ClassificationResult {
  const text = description.toLowerCase().trim();
  
  // Calculate scores for each category
  let billableScore = 0;
  let burnScore = 0;
  let scopeRiskScore = 0;
  
  // Check billable keywords
  for (const keyword of BILLABLE_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      billableScore += keyword.split(' ').length; // Multi-word matches score higher
    }
  }
  
  // Check burn keywords
  for (const keyword of BURN_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      burnScore += keyword.split(' ').length;
    }
  }
  
  // Check scope risk keywords
  for (const keyword of SCOPE_RISK_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      scopeRiskScore += keyword.split(' ').length * 1.5; // Weight scope risk higher
    }
  }
  
  // Determine category
  let category: WorkCategory = 'unclassified';
  let confidence = 0;
  let reasoning = '';
  
  const totalScore = billableScore + burnScore + scopeRiskScore;
  
  if (scopeRiskScore > 0 && scopeRiskScore >= burnScore) {
    category = 'scope_risk';
    confidence = Math.min(0.9, 0.5 + (scopeRiskScore / 10));
    reasoning = 'Detected potential scope creep indicators';
  } else if (billableScore > burnScore && billableScore > 0) {
    category = 'billable';
    confidence = Math.min(0.95, 0.6 + (billableScore / (totalScore || 1)) * 0.35);
    reasoning = 'Matches revenue-generating work patterns';
  } else if (burnScore > 0) {
    category = 'margin_burn';
    confidence = Math.min(0.9, 0.5 + (burnScore / (totalScore || 1)) * 0.4);
    reasoning = 'Matches non-billable overhead patterns';
  } else {
    category = 'unclassified';
    confidence = 0.3;
    reasoning = 'No strong pattern match - manual review recommended';
  }
  
  // Determine burn reason if applicable
  let burnReason: BurnReason | null = null;
  if (category === 'margin_burn' || category === 'scope_risk') {
    burnReason = detectBurnReason(text);
  }
  
  return {
    category,
    burn_reason: burnReason,
    confidence,
    reasoning,
  };
}

/**
 * Detect the specific reason for margin burn
 */
function detectBurnReason(text: string): BurnReason {
  let bestMatch: BurnReason = 'other';
  let bestScore = 0;
  
  for (const [reason, patterns] of Object.entries(BURN_REASON_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = reason as BurnReason;
    }
  }
  
  return bestMatch;
}

/**
 * Calculate cost impact from duration and hourly rate
 */
export function calculateCostImpact(durationMinutes: number, hourlyRate: number): number {
  return (durationMinutes / 60) * hourlyRate;
}

/**
 * Get severity level based on cost impact
 */
export function getSeverity(costImpact: number): 'low' | 'medium' | 'high' | 'critical' {
  if (costImpact < 50) return 'low';
  if (costImpact < 200) return 'medium';
  if (costImpact < 500) return 'high';
  return 'critical';
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, symbol = '$'): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/**
 * Get human-readable burn reason label
 */
export function getBurnReasonLabel(reason: BurnReason | null): string {
  const labels: Record<BurnReason, string> = {
    scope_creep: 'Scope Creep',
    internal_meeting: 'Internal Meeting',
    rework: 'Rework / Bug Fix',
    admin: 'Admin / Overhead',
    communication: 'Communication',
    planning: 'Planning / Strategy',
    research: 'Research / Learning',
    setup: 'Setup / Config',
    other: 'Other',
  };
  return reason ? labels[reason] : 'Unknown';
}

/**
 * Get category display info
 */
export function getCategoryInfo(category: WorkCategory): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  const info: Record<WorkCategory, { label: string; color: string; bgColor: string; icon: string }> = {
    billable: {
      label: 'Billable',
      color: 'text-secure-400',
      bgColor: 'bg-secure-950/50',
      icon: '✓',
    },
    margin_burn: {
      label: 'Margin Burn',
      color: 'text-burn-400',
      bgColor: 'bg-burn-950/50',
      icon: '🔥',
    },
    scope_risk: {
      label: 'Scope Risk',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-950/50',
      icon: '⚠️',
    },
    unclassified: {
      label: 'Unclassified',
      color: 'text-slate-400',
      bgColor: 'bg-slate-800/50',
      icon: '?',
    },
  };
  return info[category];
}
