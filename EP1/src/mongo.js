const MongoDB = require('mongodb')

const connectionURL = process.env.MONGO_URL;

module.exports = MongoDB.MongoClient(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

