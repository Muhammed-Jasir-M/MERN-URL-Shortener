import { nanoid } from "nanoid";
import UrlModel from "../models/url_model.js";

export const shortenUrl = async (req, res) => {
  const { longUrl, customAlias } = req.body;

  console.log("shortenUrl req body: ", req.body);

  if (!longUrl) {
    console.log("URL is required");

    return res.status(400).json({ message: "URL is required" });
  }

  const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
  if (!urlPattern.test(longUrl)) {
    console.log("Invalid URL format:", longUrl);

    res.status(400).json({ error: 'Invalid URL format' });
    return;
  }

  // Validate custom alias if provided
  if (customAlias) {
    const aliasPattern = /^[a-zA-Z0-9-]{3,30}$/;
    if (!aliasPattern.test(customAlias)) {
      return res.status(400).json({ 
        error: 'Custom alias must be 3-30 characters, alphanumeric and hyphens only' 
      });
    }

    const aliasExists = await UrlModel.findOne({ shortCode: customAlias });
    if (aliasExists) {
      return res.status(409).json({ error: 'This custom alias is already taken' });
    }
  }

  try {
    let urlExists = await UrlModel.findOne({ longUrl });

    if (urlExists && !customAlias) {
      console.log("URL already short: ", urlExists);

      return res.json({
        longUrl: urlExists.longUrl,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${urlExists.shortCode}`,
        clicks: urlExists.clicks,
        shortCode: urlExists.shortCode,
        createdAt: urlExists.createdAt,
      });
    }

    const shortCode = customAlias || nanoid(6);
    const newUrl = await UrlModel.create({ 
      longUrl, 
      shortCode,
      customAlias: customAlias || null,
    });

    console.log("New short URL created:", newUrl);

    res.json({
      longUrl: longUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${shortCode}`,
      shortCode: shortCode,
      clicks: newUrl.clicks,
      createdAt: newUrl.createdAt,
    });
  } catch (err) {
    console.error('Error in shortenUrl:', err);

    res.status(500).json({ message: "Server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    console.log("redirectUrl req params:", req.params);

    if (!shortCode) {
      console.log("Short code is required");
      return res.status(400).json({ message: "Short code is required" });
    }

    const url = await UrlModel.findOne({ shortCode });

    if (!url) {
      console.log("URL not found for short code:", shortCode);
      return res.status(404).json({ message: "URL not found" });
    }

    url.clicks += 1;
    await url.save();

    console.log("URL found:", url);

    res.redirect(url.longUrl);
  } catch (err) {
    console.error('Error in redirectUrl:', err);

    res.status(500).json({ message: "Server error" });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;
    console.log('getUrlStats req params: ', req.params);

    const url = await UrlModel.findOne({ shortCode });

    if (!url) {
      console.log('URL not found for short code:', shortCode);
      res.status(404).json({ error: 'URL not found' });
      return;
    }

    console.log('URL stats:', url);

    res.json({
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error('Error in getUrlStats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await UrlModel.find().sort({ createdAt: -1 });

    res.json(urls.map(url => ({
      longUrl: url.longUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    })));

    console.log('All URLs retrieved:', urls.length);
  } catch (error) {
    console.error('Error in getAllUrls:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    console.log('deleteUrl req params:', req.params);

    const url = await UrlModel.findOneAndDelete({ shortCode });

    if (!url) {
      console.log('URL not found for short code:', shortCode);
      return res.status(404).json({ error: 'URL not found' });
    }

    console.log('URL deleted:', url);
    res.json({ message: 'URL deleted successfully', shortCode });
  } catch (error) {
    console.error('Error in deleteUrl:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStatsSummary = async (req, res) => {
  try {
    const totalUrls = await UrlModel.countDocuments();
    const result = await UrlModel.aggregate([
      { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
    ]);

    const totalClicks = result.length > 0 ? result[0].totalClicks : 0;

    res.json({
      totalUrls,
      totalClicks,
      avgClicks: totalUrls > 0 ? Math.round((totalClicks / totalUrls) * 10) / 10 : 0,
    });

    console.log('Stats summary:', { totalUrls, totalClicks });
  } catch (error) {
    console.error('Error in getStatsSummary:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
