import { DomainConfig } from '../types';
import PM_CONFIG from './product-management';

const DOMAINS: Record<string, DomainConfig> = {
  'product-management': PM_CONFIG,
  // Future: 'engineering-management': EM_CONFIG,
  // Future: 'data-science': DS_CONFIG,
};

export function getDomain(slug: string): DomainConfig | null {
  return DOMAINS[slug] ?? null;
}

export function listDomains(): DomainConfig[] {
  return Object.values(DOMAINS);
}
