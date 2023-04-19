const { MongoClient } = require('mongodb');
const { DB_HOST, DB_NAME } = process.env;

const connectToDatabase = async () => {
    const client = new MongoClient(DB_HOST, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);
    return db;
};

module.exports = { connectToDatabase };
