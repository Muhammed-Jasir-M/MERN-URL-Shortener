import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import type { UrlHistoryProps } from '../types/types';

const UrlHistory = ({ urlHistory, handleCopy, handleRefreshStats }: UrlHistoryProps) => (
  <div className="bg-white rounded-3xl shadow-xl p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Link History</h2>

    <div className="divide-y divide-gray-200">
      {urlHistory.map((url) => (
        <div
          key={url.shortCode}
          className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition hover:bg-indigo-50/50 px-4 rounded-xl"
        >
          <div className="flex-1 min-w-0">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium text-lg flex items-center gap-1 truncate"
            >
              {url.shortUrl}
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-sm text-gray-600 truncate">{url.longUrl}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
              <span className="text-sm font-medium">{url.clicks}</span>
            </div>

            <button
              onClick={() => handleCopy(url.shortUrl)}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg transition"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleRefreshStats(url.shortCode)}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UrlHistory;

