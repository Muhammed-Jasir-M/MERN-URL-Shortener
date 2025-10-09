import { useEffect, useState } from 'react';
import { Link } from 'lucide-react';
import { shortenUrl, getStats, getAllUrls } from '../api/url_api';
import UrlInputSection from '../components/UrlInputSection';
import CurrentShortUrl from '../components/CurrentShortUrl';
import UrlHistory from '../components/UrlHistory';
import type { ShortenedUrl } from '../types/types';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [currentShortUrl, setCurrentShortUrl] = useState<ShortenedUrl | null>(null);
  const [urlHistory, setUrlHistory] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAllUrls();
        setUrlHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

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
      setUrlHistory((prev) => [data, ...prev.filter((item) => item.shortCode !== data.shortCode)]);
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
        setCurrentShortUrl((prev: ShortenedUrl | null) =>
          prev ? { ...prev, clicks: data.clicks } : null
        );
      }
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="p-5 bg-indigo-600 rounded-2xl shadow-xl">
              <Link className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
            Smart URL Shortener
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Simplify your links, track clicks, and share smarter.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-indigo-100">
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

