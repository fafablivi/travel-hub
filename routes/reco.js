const express = require('express');
const router = express.Router();
const driver = require('../services/neo4jClient');

router.get('/', async (req, res) => {
    const { city, k = 3 } = req.query;

    if (!city) return res.status(400).json({ error: 'Paramètre city requis' });

    const session = driver.session();

    try {
        const result = await session.run(
            `
        MATCH (c:City {code: $city})-[r:NEAR]->(n:City)
        RETURN n.code AS city, r.weight AS score
        ORDER BY score DESC
        LIMIT toInteger($k)
        `,
            { city, k: parseInt(k) }
        );

        const cities = result.records.map(r => ({
            city: r.get('city'),
            score: r.get('score')
        }));

        console.log(`[Reco] ${cities.length} villes trouvées pour ${city}`);
        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: 'Erreur Neo4j', details: err.message });
    } finally {
        await session.close();
    }
});

module.exports = router;
