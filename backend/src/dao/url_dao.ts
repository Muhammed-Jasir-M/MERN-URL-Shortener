import UrlModel from '../models/url_model.js';
import type { IUrl, UserContext } from '../types/index.js';
import type { Types } from 'mongoose';

class UrlDao {
  async createUrl(urlData: Partial<IUrl>): Promise<IUrl> {
    return await UrlModel.create(urlData);
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    return await UrlModel.findOne({ shortCode });
  }

  async findExistingUrl({ longUrl, userId, guestId }: { longUrl: string } & UserContext): Promise<IUrl | null> {
    const query: Record<string, any> = { longUrl };
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;

    return await UrlModel.findOne(query);
  }

  async findAllUrls({ userId, guestId }: UserContext): Promise<IUrl[]> {
    let query: Record<string, any> = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }
    return await UrlModel.find(query).sort({ createdAt: -1 });
  }

  async incrementClicks(shortCode: string): Promise<IUrl | null> {
    const url = await UrlModel.findOne({ shortCode });
    if (!url) return null;

    url.clicks += 1;
    await url.save();
    return url;
  }

  async deleteUrl({ shortCode, userId, guestId }: { shortCode: string } & UserContext): Promise<IUrl | null> {
    let query: Record<string, any> = { shortCode };
    if (userId) {
      query.userId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    return await UrlModel.findOneAndDelete(query);
  }

  async countUrls({ userId, guestId }: UserContext): Promise<number> {
    let query: Record<string, any> = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }
    return await UrlModel.countDocuments(query);
  }

  async aggregateClicks({ userId, guestId }: UserContext): Promise<number> {
    let query: Record<string, any> = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }

    const result = await UrlModel.aggregate([
      { $match: query },
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } },
    ]);

    return result.length > 0 ? result[0].totalClicks : 0;
  }

  async migrateGuestUrlsToUser(guestId: string, userId: string | Types.ObjectId): Promise<void> {
    const guestUrls = await UrlModel.find({ guestId });
    if (guestUrls.length === 0) return;

    for (const guestUrl of guestUrls) {
      // Check if user already owns a link with the exact same longUrl
      const existingUserUrl = await UrlModel.findOne({ userId, longUrl: guestUrl.longUrl });

      if (existingUserUrl && !guestUrl.customAlias) {
        // Merge clicks into existing user URL and remove guest duplicate
        existingUserUrl.clicks += guestUrl.clicks;
        await existingUserUrl.save();
        await UrlModel.findByIdAndDelete(guestUrl._id);
      } else {
        // Transfer guest URL ownership to user
        guestUrl.userId = userId as Types.ObjectId;
        guestUrl.guestId = null;
        await guestUrl.save();
      }
    }
  }
}

export default new UrlDao();
