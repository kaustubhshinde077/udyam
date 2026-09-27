import React from 'react';
import { DataTrustStatus } from '../../types';
import { ShieldCheck, HelpCircle, User, Users, AlertTriangle } from 'lucide-react';

interface Props {
  status: DataTrustStatus;
  source?: string;
  date?: string;
  location?: string;
  compact?: boolean;
}

export const DataTrustBadge: React.FC<Props> = ({
  status,
  source,
  date,
  location,
  compact = false,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          prefix: '✓',
          label: 'VERIFIED (सत्यापित)',
        };
      case 'Estimated':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: HelpCircle,
          prefix: '~',
          label: 'ESTIMATED (अनुमानित)',
        };
      case 'User Provided':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: User,
          prefix: '👤',
          label: 'USER PROVIDED (आपल्याकडून)',
        };
      case 'Community Provided':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          icon: Users,
          prefix: '👥',
          label: 'COMMUNITY PROVIDED (ग्राम सर्वेक्षण)',
        };
      case 'AI Generated':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
          icon: ShieldCheck,
          prefix: '✦',
          label: 'AI GENERATED (विश्लेषण)',
        };
      case 'Official Source':
        return {
          bg: 'bg-teal-50 text-teal-900 border-teal-300 font-medium',
          icon: ShieldCheck,
          prefix: '🏛️',
          label: 'OFFICIAL SOURCE (शासकीय/अधिकृत संदर्भ)',
        };
      case 'Demo Data':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
          icon: HelpCircle,
          prefix: 'DEMO',
          label: 'DEMO DATA (उदाहरणात्मक)',
        };
      case 'Unavailable':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: AlertTriangle,
          prefix: '—',
          label: 'UNAVAILABLE (अनुपलब्ध)',
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${style.bg}`}
        title={source ? `${source} (${date || ''})` : style.label}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span>{style.prefix} {status.toUpperCase()}</span>
      </span>
    );
  }

  return (
    <div className={`mt-2 p-2.5 rounded-lg border text-xs ${style.bg}`}>
      <div className="flex items-center gap-2 font-semibold">
        <Icon className="w-4 h-4 shrink-0" />
        <span>Source Trust: {style.label}</span>
      </div>
      {(source || location || date) && (
        <div className="mt-1 text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
          {source && <span><strong>Source:</strong> {source}</span>}
          {location && <span><strong>Area:</strong> {location}</span>}
          {date && <span><strong>Date:</strong> {date}</span>}
        </div>
      )}
    </div>
  );
};
