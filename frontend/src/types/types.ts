export interface ShortenedUrl {
  longUrl: string;
  shortUrl: string;
  shortCode: string;
  clicks: number;
  createdAt?: string;
  customAlias?: string;
}

export interface StatsSummary {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
}

export interface UrlInputSectionProps {
  longUrl: string;
  setLongUrl: (value: string) => void;
  customAlias: string;
  setCustomAlias: (value: string) => void;
  handleShorten: () => void;
  loading: boolean;
  error: string;
}

export interface CurrentShortUrlProps {
  currentShortUrl: ShortenedUrl;
  handleCopy: (url: string) => void;
  copied: boolean;
}

export interface UrlHistoryProps {
  urlHistory: ShortenedUrl[];
  handleCopy: (url: string) => void;
  handleRefreshStats: (shortCode: string) => void;
  handleDelete: (shortCode: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}
