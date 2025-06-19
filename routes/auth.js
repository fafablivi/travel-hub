const express = require('express');
const router = express.Router();
const redis = require('../services/redisClient');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId manquant' });
    }

    const token = uuidv4();
    try {
        await redis.setEx(`session:${token}`, 900, userId);
        res.json({ token, expires_in: 900 });
    } catch (err) {
        res.status(500).json({ error: 'Erreur Redis', details: err.message });
    }
});

module.exports = router;