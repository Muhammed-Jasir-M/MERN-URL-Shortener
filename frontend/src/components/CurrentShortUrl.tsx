import { Copy, ExternalLink, BarChart3 } from 'lucide-react';
import type { CurrentShortUrlProps } from '../types/types';



const CurrentShortUrl = ({ currentShortUrl, handleCopy, copied }: CurrentShortUrlProps) => (
    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 transition-all">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Shortened URL</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>{currentShortUrl.clicks} clicks</span>
            </div>
        </div>

        <div className="flex gap-2 mb-3">
            <input
                type="text"
                value={currentShortUrl.shortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-indigo-600 font-medium"
            />
            <button
                onClick={() => handleCopy(currentShortUrl.shortUrl)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
                href={currentShortUrl.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
                <ExternalLink className="w-4 h-4" />
                Visit
            </a>
        </div>

        <div className="text-sm text-gray-600">
            <span className="font-medium">Original:</span>{' '}
            <span className="break-all">{currentShortUrl.longUrl}</span>
        </div>
    </div>
);

export default CurrentShortUrl;
