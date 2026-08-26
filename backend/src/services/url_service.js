import { nanoid } from 'nanoid';
import urlDao from '../dao/url_dao.js';

class UrlService {
  async shortenUrl({ longUrl, customAlias, userId, guestId }) {
    if (!longUrl) {
      const err = new Error('URL is required');
      err.statusCode = 400;
      throw err;
    }

    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
    if (!urlPattern.test(longUrl)) {
      const err = new Error('Invalid URL format');
      err.statusCode = 400;
      throw err;
    }

    if (customAlias) {
      const aliasPattern = /^[a-zA-Z0-9-]{3,30}$/;
      if (!aliasPattern.test(customAlias)) {
        const err = new Error('Custom alias must be 3-30 characters, alphanumeric and hyphens only');
        err.statusCode = 400;
        throw err;
      }

      const aliasExists = await urlDao.findByShortCode(customAlias);
      if (aliasExists) {
        const err = new Error('This custom alias is already taken');
        err.statusCode = 409;
        throw err;
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
      userId: userId || null,
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

  async redirectUrl(shortCode) {
    if (!shortCode) {
      const err = new Error('Short code is required');
      err.statusCode = 400;
      throw err;
    }

    const url = await urlDao.incrementClicks(shortCode);
    if (!url) {
      const err = new Error('URL not found');
      err.statusCode = 404;
      throw err;
    }

    return url.longUrl;
  }

  async getUrlStats(shortCode) {
    const url = await urlDao.findByShortCode(shortCode);
    if (!url) {
      const err = new Error('URL not found');
      err.statusCode = 404;
      throw err;
    }

    return {
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    };
  }

  async getAllUrls({ userId, guestId }) {
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

  async deleteUrl({ shortCode, userId, guestId }) {
    const deletedUrl = await urlDao.deleteUrl({ shortCode, userId, guestId });
    if (!deletedUrl) {
      const err = new Error('URL not found or unauthorized');
      err.statusCode = 404;
      throw err;
    }

    return { message: 'URL deleted successfully', shortCode };
  }

  async getStatsSummary({ userId, guestId }) {
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
