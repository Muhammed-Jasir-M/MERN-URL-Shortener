import { nanoid } from "nanoid";
import UrlModel from "../models/url_model.js";

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  console.log("shortenUrl req body: ", req.body);

  if (!longUrl) {
    console.log("URL is required");

    return res.status(400).json({ message: "URL is required" });
  }

  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(longUrl)) {
    console.log("Invalid URL format:", longUrl);

    res.status(400).json({ error: 'Invalid URL format' });
    return;
  }

  const normalizedUrl = longUrl.endsWith("/") && longUrl.length > 8
    ? longUrl.slice(0, -1)
    : longUrl;

  try {
    let urlExists = await UrlModel.findOne({ longUrl });

    if (urlExists) {
      console.log("URL already short: ", urlExists);

      return res.json({
        longUrl: urlExists.longUrl,
        shortUrl: `${process.env.BASE_URL}/${urlExists.shortCode}`,
        clicks: urlExists.clicks,
        shortCode: urlExists.shortCode,
      });
    }

    const shortCode = nanoid(6);
    const newUrl = await UrlModel.create({ longUrl, shortCode });

    console.log("New short URL created:", newUrl);

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
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    })));

    console.log('All URLs retrieved:', urls);
  } catch (error) {
    console.error('Error in getAllUrls:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

