const mongoose = require('mongoose');
const { DB_HOST, DB_NAME } = process.env;

const connectToDatabase = async () => {
    try {
        const connectionUri = `${DB_HOST}/${DB_NAME}`;
        await mongoose.connect(connectionUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            writeConcern: {
                w: 'majority', // Use 'majority' or another valid write concern mode
                wtimeout: 5000, // Timeout in milliseconds (optional)
            },
        });

        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

module.exports = { connectToDatabase };
