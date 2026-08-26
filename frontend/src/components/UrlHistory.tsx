import { useState } from 'react';
import {
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  Search,
  Check,
  QrCode,
  X,
  Link2,
  MousePointerClick,
  Clock,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { UrlHistoryProps, ShortenedUrl } from '../types/types';

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const UrlCard = ({
  url,
  handleCopy,
  handleRefreshStats,
  handleDelete,
}: {
  url: ShortenedUrl;
  handleCopy: (url: string) => void;
  handleRefreshStats: (shortCode: string) => void;
  handleDelete: (shortCode: string) => void;
}) => {
  const [copiedThis, setCopiedThis] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onCopy = () => {
    handleCopy(url.shortUrl);
    setCopiedThis(true);
    setTimeout(() => setCopiedThis(false), 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleRefreshStats(url.shortCode);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="bg-white hover:bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-extrabold text-violet-700 hover:text-violet-900 text-base sm:text-lg whitespace-nowrap truncate min-w-0 max-w-full hover:underline inline-flex items-center gap-1.5"
          title={url.shortUrl}
        >
          <span className="truncate">{url.shortUrl}</span>
          <ExternalLink className="w-4 h-4 text-violet-400 hover:text-violet-600 flex-shrink-0" />
        </a>
      </div>

      <div className="text-xs text-slate-500 font-medium space-y-0.5 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Original URL</span>
        <p className="line-clamp-2 break-all text-slate-600 font-normal leading-relaxed hover:line-clamp-none transition-all" title={url.longUrl}>
          {url.longUrl}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 min-w-0">
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={onCopy}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              copiedThis
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-violet-700 hover:bg-white'
            }`}
            title="Copy Short URL"
          >
            {copiedThis ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              showQr
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-violet-700 hover:bg-white'
            }`}
            title="Toggle QR Code"
          >
            {showQr ? <X className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
          </button>

          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-600 hover:text-violet-700 hover:bg-white transition-all"
            title="Refresh Click Count"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-violet-600' : ''}`} />
          </button>

          <button
            onClick={() => handleDelete(url.shortCode)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete Link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full font-bold whitespace-nowrap">
            <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />
            {url.clicks} clicks
          </span>

          {url.createdAt && (
            <span className="flex items-center gap-1 text-slate-400 font-medium whitespace-nowrap">
              <Clock className="w-3.5 h-3.5" />
              {formatRelativeTime(url.createdAt)}
            </span>
          )}
        </div>
      </div>

      {showQr && (
        <div className="pt-3 border-t border-slate-100 flex justify-center animate-in fade-in duration-200">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-1.5">
            <QRCodeSVG value={url.shortUrl} size={140} bgColor="white" fgColor="#1e1b4b" level="M" />
            <span className="text-[10px] font-semibold text-slate-400">Scan QR Code</span>
          </div>
        </div>
      )}
    </div>
  );
};

const UrlHistory = ({
  urlHistory,
  handleCopy,
  handleRefreshStats,
  handleDelete,
  searchQuery,
  setSearchQuery,
}: UrlHistoryProps) => {
  const filteredUrls = urlHistory.filter(
    (url) =>
      url.longUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Shortened Links</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Showing {filteredUrls.length} of {urlHistory.length} total links
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* URL Cards Grid */}
      {filteredUrls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUrls.map((url) => (
            <UrlCard
              key={url.shortCode}
              url={url}
              handleCopy={handleCopy}
              handleRefreshStats={handleRefreshStats}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 mx-auto flex items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No matching links found' : 'No shortened links yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try searching for a different URL or keyword.'
              : 'Go to the home page to create your first shortened URL.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlHistory;
