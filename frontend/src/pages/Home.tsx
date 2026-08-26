import { useEffect, useState } from 'react';
import { shortenUrl, getStatsSummary } from '../api/url_api';
import UrlInputSection from '../components/UrlInputSection';
import CurrentShortUrl from '../components/CurrentShortUrl';
import StatsPill from '../components/StatsPill';
import TrustBadges from '../components/TrustBadges';
import FeatureGrid from '../components/FeatureGrid';
import HowItWorksSection from '../components/HowItWorksSection';
import type { ShortenedUrl, StatsSummary } from '../types/types';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [currentShortUrl, setCurrentShortUrl] = useState<ShortenedUrl | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<StatsSummary | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatsSummary();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await shortenUrl(longUrl, customAlias);
      setCurrentShortUrl(data);
      setLongUrl('');
      setCustomAlias('');
      const newStats = await getStatsSummary();
      setStats(newStats);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to shorten URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* Decorative Gradient Orbs Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Stats Live Pill */}
          <StatsPill stats={stats} />

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Shorten, Share & Track <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Your Digital Links
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Transform long, messy web links into clean, trackable short URLs and QR codes with analytics.
          </p>

          {/* Main Shortener Form Card */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xl shadow-violet-500/10">
              <UrlInputSection
                longUrl={longUrl}
                setLongUrl={setLongUrl}
                customAlias={customAlias}
                setCustomAlias={setCustomAlias}
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
          </div>

          {/* Trust Badges */}
          <TrustBadges />
        </div>

        {/* Feature Grid */}
        <FeatureGrid />

        {/* How It Works Section */}
        <HowItWorksSection />
      </div>
    </div>
  );
}
