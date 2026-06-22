/* eslint-disable react-refresh/only-export-components */
import { Tag } from './ui';
import { ProofType } from '../data/projects';

const proofCopy: Record<ProofType, { label: string; className: string }> = {
  demo: {
    label: 'Demo interactiva',
    className: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25'
  },
  concept: {
    label: 'Concepto',
    className: 'bg-amber-500/12 text-amber-200 border-amber-500/25'
  },
  'strategic-build': {
    label: 'Caso de uso estrategico',
    className: 'bg-brand-500/12 text-brand-200 border-brand-500/25'
  }
};

export function ProofBadge({ type }: { type: ProofType }) {
  const item = proofCopy[type];
  return (
    <Tag variant="outline" className={item.className}>
      {item.label}
    </Tag>
  );
}

export function getProofLabel(type: ProofType) {
  return proofCopy[type].label;
}
