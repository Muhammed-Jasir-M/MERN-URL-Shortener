import { Copy, ExternalLink, BarChart3 } from 'lucide-react';
import type { UrlHistoryProps } from '../types/types';

const UrlHistory = ({ urlHistory, handleCopy, handleRefreshStats }: UrlHistoryProps) => (
  <div className="bg-white rounded-3xl shadow-2xl p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent URLs</h2>
    <div className="space-y-4">
      {urlHistory.map((url) => (
        <div
          key={url.shortCode}
          className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1"
                >
                  {url.shortUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => handleCopy(url.shortUrl)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 break-all">{url.longUrl}</p>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="flex items-center gap-1 text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">{url.clicks}</span>
              </div>
              <button
                onClick={() => handleRefreshStats(url.shortCode)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UrlHistory;
