import { useState } from 'react';
import { Link } from 'lucide-react';
import { shortenUrl, getStats } from '../api/url_api';
import type { ShortenedUrl } from '../types/types';
import UrlInputSection from '../components/UrlInputSection';
import CurrentShortUrl from '../components/CurrentShortUrl';
import UrlHistory from '../components/UrlHistory';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [currentShortUrl, setCurrentShortUrl] = useState<ShortenedUrl | null>(null);
  const [urlHistory, setUrlHistory] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await shortenUrl(longUrl);
      setCurrentShortUrl(data);

      setUrlHistory((prev) => {
        const exists = prev.find((item) => item.shortCode === data.shortCode);
        return exists
          ? prev.map((item) => (item.shortCode === data.shortCode ? data : item))
          : [data, ...prev];
      });

      setLongUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshStats = async (shortCode: string) => {
    try {
      const data = await getStats(shortCode);
      setUrlHistory((prev) =>
        prev.map((item) =>
          item.shortCode === shortCode ? { ...item, clicks: data.clicks } : item
        )
      );
      if (currentShortUrl?.shortCode === shortCode) {
        setCurrentShortUrl((prev) =>
          prev ? { ...prev, clicks: data.clicks } : null
        );
      }
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
              <Link className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">URL Shortener</h1>
          <p className="text-gray-600 text-lg">
            Transform long URLs into short, shareable links.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 transition-all">
          <UrlInputSection
            longUrl={longUrl}
            setLongUrl={setLongUrl}
            handleShorten={handleShorten}
            loading={loading}
            error={error}
          />

          {currentShortUrl && (
            <CurrentShortUrl
              currentShortUrl={currentShortUrl}
              handleCopy={handleCopy}
              copied={copied}
            />
          )}
        </div>

        {urlHistory.length > 0 && (
          <UrlHistory
            urlHistory={urlHistory}
            handleCopy={handleCopy}
            handleRefreshStats={handleRefreshStats}
          />
        )}
      </div>
    </div>
  );
}
