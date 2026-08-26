import { MousePointerClick } from 'lucide-react';
import type { StatsSummary } from '../types/types';

interface StatsPillProps {
  stats: StatsSummary | null;
}

export default function StatsPill({ stats }: StatsPillProps) {
  if (!stats || stats.totalUrls === 0) return null;

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/90 border border-violet-200/80 shadow-sm text-xs font-bold text-slate-700 animate-in fade-in slide-in-from-top-2 duration-300 max-w-full">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
      <MousePointerClick className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
      <span>
        <strong className="text-violet-700">{stats.totalUrls.toLocaleString()}</strong> Links Shortened
      </span>
      <span className="text-slate-300 hidden sm:inline">•</span>
      <span>
        <strong className="text-emerald-600">{stats.totalClicks.toLocaleString()}</strong> Clicks Tracked
      </span>
    </div>
  );
}
