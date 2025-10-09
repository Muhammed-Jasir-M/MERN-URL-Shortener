import { Globe } from 'lucide-react';
import type { UrlInputSectionProps } from '../types/types';

const UrlInputSection = ({ longUrl, setLongUrl, handleShorten, loading, error }: UrlInputSectionProps) => (
    <div className="space-y-4">
        <div className="relative">
            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                placeholder="Enter your long URL here..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-gray-700 text-lg transition-all"
            />
        </div>

        {error && error.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
            </div>
        )}

        <button
            onClick={handleShorten}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
        >
            {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
    </div>
);

export default UrlInputSection;

