import { ShieldCheck, Globe2, Sparkles } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-semibold text-slate-500">
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Safe & Secure
      </span>
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        <Globe2 className="w-4 h-4 text-violet-500 flex-shrink-0" /> Fast Global Redirects
      </span>
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" /> Custom Slugs Included
      </span>
    </div>
  );
}
