const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db = null;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('travelhub');
    console.log('[Mongo] Connecté à la base:', db.databaseName);
  }
  return db;
}

module.exports = { getDb: connect };
