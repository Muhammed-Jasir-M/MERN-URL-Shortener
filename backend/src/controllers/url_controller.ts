import type { Request, Response } from 'express';
import urlService from '../services/url_service.js';
import { AppError } from '../types/index.js';

const getGuestId = (req: Request): string | undefined => {
  const header = req.headers['x-guest-id'];
  if (Array.isArray(header)) return header[0];
  if (header) return header;
  if (typeof req.query.guestId === 'string') return req.query.guestId;
  return undefined;
};

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const userId = req.user ? req.user.id : null;
  const guestId = req.body.guestId || getGuestId(req) || null;

  console.log(`[${timestamp}] [URL REQUEST] POST /api/v1/url/shorten - longUrl: ${req.body.longUrl}, customAlias: ${req.body.customAlias || 'none'}`);

  try {
    const result = await urlService.shortenUrl({
      longUrl: req.body.longUrl,
      customAlias: req.body.customAlias,
      userId,
      guestId,
    });

    console.log(`[${timestamp}] [URL SUCCESS] 200 OK - Short URL generated: ${result.shortUrl} (Reused: ${result.isReused})`);
    res.json(result);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [URL ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const shortCode = req.params.shortCode as string;

  console.log(`[${timestamp}] [REDIRECT REQUEST] GET /${shortCode}`);

  try {
    const targetUrl = await urlService.redirectUrl(shortCode);
    console.log(`[${timestamp}] [REDIRECT SUCCESS] 302 Found - Redirecting to: ${targetUrl}`);
    res.redirect(targetUrl);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [REDIRECT ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const getUrlStats = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const shortCode = req.params.shortCode as string;

  console.log(`[${timestamp}] [URL REQUEST] GET /api/v1/url/stats/${shortCode}`);

  try {
    const stats = await urlService.getUrlStats(shortCode);
    console.log(`[${timestamp}] [URL SUCCESS] 200 OK - Stats retrieved for: ${shortCode}`);
    res.json(stats);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [URL ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const getAllUrls = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const userId = req.user ? req.user.id : null;
  const guestId = getGuestId(req) || null;

  console.log(`[${timestamp}] [URL REQUEST] GET /api/v1/url/getAllUrls - userId: ${userId || 'none'}, guestId: ${guestId || 'none'}`);

  try {
    const urls = await urlService.getAllUrls({ userId, guestId });
    console.log(`[${timestamp}] [URL SUCCESS] 200 OK - Fetched ${urls.length} URLs`);
    res.json(urls);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [URL ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const shortCode = req.params.shortCode as string;
  const userId = req.user ? req.user.id : null;
  const guestId = getGuestId(req) || null;

  console.log(`[${timestamp}] [URL REQUEST] DELETE /api/v1/url/${shortCode} - userId: ${userId || 'none'}`);

  try {
    const result = await urlService.deleteUrl({ shortCode, userId, guestId });
    console.log(`[${timestamp}] [URL SUCCESS] 200 OK - Deleted URL: ${shortCode}`);
    res.json(result);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [URL ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const getStatsSummary = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  const userId = req.user ? req.user.id : null;
  const guestId = getGuestId(req) || null;

  console.log(`[${timestamp}] [URL REQUEST] GET /api/v1/url/stats/summary - userId: ${userId || 'none'}`);

  try {
    const summary = await urlService.getStatsSummary({ userId, guestId });
    console.log(`[${timestamp}] [URL SUCCESS] 200 OK - Summary retrieved: ${summary.totalUrls} URLs, ${summary.totalClicks} clicks`);
    res.json(summary);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[${timestamp}] [URL ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};
