const express = require('express');
const router = express.Router();
const redis = require('../services/redisClient');
const { getDb } = require('../services/mongoClient');
const zlib = require('zlib');

router.get('/', async (req, res) => {
  const { from, to, limit = 10 } = req.query;
  const cacheKey = `offers:${from}:${to}`;

  try {
    // Clé cache Redis offers:PAR:TYO (TTL 60 s). Si hit → retour immédiat
    const cached = await redis.get(cacheKey);
    if (cached) {
      const buffer = Buffer.from(cached, 'base64');
      const unzipped = zlib.gunzipSync(buffer).toString();
      return res.json(JSON.parse(unzipped));
    }

    // Requête MongoDB sur la collection offers
    const db = await getDb();
    const offers = await db.collection('offers')
      .find({ from, to })
      .project({
        provider: 1,
        price: 1,
        currency: 1,
        legs: 1
      })
      .sort({ price: 1 })
      .limit(parseInt(limit))
      .toArray();


    // Stockage JSON compressé dans Redis SET EX 60
    const json = JSON.stringify(offers);
    const gzipped = zlib.gzipSync(json).toString('base64');
    await redis.setEx(cacheKey, 60, gzipped);

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur interne', details: err.message });
  }
});

module.exports = router;
