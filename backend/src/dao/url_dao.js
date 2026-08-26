import UrlModel from '../models/url_model.js';

class UrlDao {
  async createUrl(urlData) {
    return await UrlModel.create(urlData);
  }

  async findByShortCode(shortCode) {
    return await UrlModel.findOne({ shortCode });
  }

  async findExistingUrl({ longUrl, userId, guestId }) {
    const query = { longUrl };
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;

    return await UrlModel.findOne(query);
  }

  async findAllUrls({ userId, guestId }) {
    let query = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }
    return await UrlModel.find(query).sort({ createdAt: -1 });
  }

  async incrementClicks(shortCode) {
    const url = await UrlModel.findOne({ shortCode });
    if (!url) return null;

    url.clicks += 1;
    await url.save();
    return url;
  }

  async deleteUrl({ shortCode, userId, guestId }) {
    let query = { shortCode };
    if (userId) {
      query.userId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    return await UrlModel.findOneAndDelete(query);
  }

  async countUrls({ userId, guestId }) {
    let query = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }
    return await UrlModel.countDocuments(query);
  }

  async aggregateClicks({ userId, guestId }) {
    let query = {};
    if (userId) {
      query = { userId };
    } else if (guestId) {
      query = { guestId };
    }

    const result = await UrlModel.aggregate([
      { $match: query },
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);

    return result.length > 0 ? result[0].totalClicks : 0;
  }

  async migrateGuestUrlsToUser(guestId, userId) {
    return await UrlModel.updateMany(
      { guestId },
      { userId, guestId: null }
    );
  }
}

export default new UrlDao();
