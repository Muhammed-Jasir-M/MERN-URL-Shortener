export interface ShortenedUrl {
  longUrl: string;
  shortUrl: string;
  shortCode: string;
  clicks: number;
}

export interface UrlInputSectionProps {
  longUrl: string;
  setLongUrl: (value: string) => void;
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
}
