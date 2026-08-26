import { Link2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import type { UrlInputSectionProps } from '../types/types';

const UrlInputSection = ({
  longUrl,
  setLongUrl,
  customAlias,
  setCustomAlias,
  handleShorten,
  loading,
  error,
}: UrlInputSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Main Long URL Input */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
          <Link2 className="w-5 h-5" />
        </div>
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
          placeholder="Paste your long URL here (e.g. https://example.com/very-long-link)..."
          className="w-full pl-12 pr-4 py-4 bg-slate-50/80 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-violet-600 rounded-2xl text-slate-800 placeholder-slate-400 text-base font-medium transition-all shadow-inner focus:shadow-lg focus:shadow-violet-500/10 outline-none"
        />
      </div>

      {/* Custom Alias Input (Always visible optional input) */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
          placeholder="Custom alias (optional) — e.g. my-custom-link"
          className="w-full pl-11 pr-16 py-3 bg-slate-50/50 hover:bg-white focus:bg-white border-2 border-slate-200/80 focus:border-violet-500 rounded-xl text-slate-700 placeholder-slate-400 text-sm font-medium transition-all outline-none"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
          {customAlias.length > 0 ? `${customAlias.length}/30` : 'Optional'}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-700 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleShorten}
        disabled={loading}
        className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-700 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Short URL...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-violet-200 group-hover:rotate-12 transition-transform duration-300" />
              <span>Shorten URL</span>
              <ArrowRight className="w-5 h-5 ml-1 text-white/80 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default UrlInputSection;
