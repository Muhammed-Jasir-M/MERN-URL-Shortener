import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Plus,
} from 'lucide-react';
import { getAllUrls, getStats, deleteUrl, getStatsSummary } from '../api/url_api';
import UrlHistory from '../components/UrlHistory';
import type { ShortenedUrl, StatsSummary } from '../types/types';

import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [urlHistory, setUrlHistory] = useState<ShortenedUrl[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [urls, statsData] = await Promise.all([getAllUrls(), getStatsSummary()]);
        setUrlHistory(urls);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleRefreshStats = async (shortCode: string) => {
    try {
      const data = await getStats(shortCode);
      setUrlHistory((prev) =>
        prev.map((item) =>
          item.shortCode === shortCode ? { ...item, clicks: data.clicks } : item
        )
      );
      const newStats = await getStatsSummary();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  const handleDelete = async (shortCode: string) => {
    try {
      await deleteUrl(shortCode);
      setUrlHistory((prev) => prev.filter((item) => item.shortCode !== shortCode));
      const newStats = await getStatsSummary();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to delete URL:', err);
    }
  };

  const statCards = [
    {
      icon: Link2,
      label: 'Total Short Links',
      value: stats?.totalUrls ?? 0,
      color: 'from-violet-600 to-indigo-600',
      badge: 'Active',
    },
    {
      icon: MousePointerClick,
      label: 'Total Clicks Tracked',
      value: stats?.totalClicks ?? 0,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Real-time',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Clicks / Link',
      value: stats?.avgClicks ?? 0,
      color: 'from-amber-500 to-orange-500',
      badge: 'Engagement',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 pl-9 sm:pl-10">
              Overview of all shortened links and real-time click metrics.
            </p>
          </div>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Link</span>
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-2 sm:space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {card.badge}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </span>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link List Section */}
        <div className="bg-white p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          <UrlHistory
            urlHistory={urlHistory}
            handleCopy={handleCopy}
            handleRefreshStats={handleRefreshStats}
            handleDelete={handleDelete}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
}
