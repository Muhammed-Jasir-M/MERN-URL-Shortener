import { nanoid } from 'nanoid';
import urlDao from '../dao/url_dao.js';
import { AppError } from '../types/index.js';
import type { ShortenUrlDTO, UserContext } from '../types/index.js';

class UrlService {
  async shortenUrl({ longUrl, customAlias, userId, guestId }: ShortenUrlDTO) {
    if (!longUrl) {
      throw new AppError('URL is required', 400);
    }

    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
    if (!urlPattern.test(longUrl)) {
      throw new AppError('Invalid URL format', 400);
    }

    if (customAlias) {
      const aliasPattern = /^[a-zA-Z0-9-]{3,30}$/;
      if (!aliasPattern.test(customAlias)) {
        throw new AppError('Custom alias must be 3-30 characters, alphanumeric and hyphens only', 400);
      }

      const aliasExists = await urlDao.findByShortCode(customAlias);
      if (aliasExists) {
        throw new AppError('This custom alias is already taken', 409);
      }
    }

    // Check if longUrl already exists for this user/guest (if no custom alias)
    if (!customAlias) {
      const existingUrl = await urlDao.findExistingUrl({ longUrl, userId, guestId });
      if (existingUrl) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        return {
          longUrl: existingUrl.longUrl,
          shortUrl: `${baseUrl}/${existingUrl.shortCode}`,
          clicks: existingUrl.clicks,
          shortCode: existingUrl.shortCode,
          createdAt: existingUrl.createdAt,
          isReused: true,
        };
      }
    }

    const shortCode = customAlias || nanoid(6);
    const newUrl = await urlDao.createUrl({
      longUrl,
      shortCode,
      customAlias: customAlias || null,
      userId: userId ? (userId as any) : null,
      guestId: userId ? null : (guestId || null),
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return {
      longUrl: newUrl.longUrl,
      shortUrl: `${baseUrl}/${shortCode}`,
      shortCode: newUrl.shortCode,
      clicks: newUrl.clicks,
      createdAt: newUrl.createdAt,
      isReused: false,
    };
  }

  async redirectUrl(shortCode: string) {
    if (!shortCode) {
      throw new AppError('Short code is required', 400);
    }

    const url = await urlDao.incrementClicks(shortCode);
    if (!url) {
      throw new AppError('URL not found', 404);
    }

    return url.longUrl;
  }

  async getUrlStats(shortCode: string) {
    const url = await urlDao.findByShortCode(shortCode);
    if (!url) {
      throw new AppError('URL not found', 404);
    }

    return {
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    };
  }

  async getAllUrls({ userId, guestId }: UserContext) {
    const urls = await urlDao.findAllUrls({ userId, guestId });
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    return urls.map((url) => ({
      longUrl: url.longUrl,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));
  }

  async deleteUrl({ shortCode, userId, guestId }: { shortCode: string } & UserContext) {
    const deletedUrl = await urlDao.deleteUrl({ shortCode, userId, guestId });
    if (!deletedUrl) {
      throw new AppError('URL not found or unauthorized', 404);
    }

    return { message: 'URL deleted successfully', shortCode };
  }

  async getStatsSummary({ userId, guestId }: UserContext) {
    const totalUrls = await urlDao.countUrls({ userId, guestId });
    const totalClicks = await urlDao.aggregateClicks({ userId, guestId });

    return {
      totalUrls,
      totalClicks,
      avgClicks: totalUrls > 0 ? Math.round((totalClicks / totalUrls) * 10) / 10 : 0,
    };
  }
}

export default new UrlService();
