import { nanoid } from "nanoid";
import UrlModel from "../models/url_model.js";

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "URL is required" });
  }

  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(longUrl)) {
    res.status(400).json({ error: 'Invalid URL format' });
    return;
  }


  try {
    let urlExists = await UrlModel.findOne({ longUrl });

    if (urlExists) {
      return res.json({
        longUrl: urlExists.longUrl,
        shortUrl: `${process.env.BASE_URL}/${urlExists.shortCode}`,
        clicks: urlExists.clicks,
        shortCode: urlExists.shortCode,
      });
    }

    const shortCode = nanoid(6);
    const newUrl = await UrlModel.create({ longUrl, shortCode });

    res.json({ 
      longUrl: longUrl, 
      shortUrl: `${process.env.BASE_URL}/${shortCode}`, 
      shortCode: shortCode, 
      clicks: newUrl.clicks
    });
  } catch (err) {
    console.error('Error in shortenUrl:', err);

    res.status(500).json({ message: "Server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.findOne({ shortCode });

    if (!url) { 
      return res.status(404).json({ message: "URL not found" }); 
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    console.error('Error in redirectUrl:', err);

    res.status(500).json({ message: "Server error" });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.findOne({ shortCode });

    if (!url) {
      res.status(404).json({ error: 'URL not found' });
      return;
    }

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
