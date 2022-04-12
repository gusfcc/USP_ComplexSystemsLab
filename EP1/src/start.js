/*                               */
/* YOU MUST NOT CHANGE THIS FILE */
/*                               */

const API = require("./api.js");
const BrokerClient = require("./nats");
const mongoClient = require("./mongo");

const PORT = process.env.API_PORT;
const ALLOWED_ORIGINS = JSON.parse(process.env.API_ALLOWED_ORIGINS);

const secret = process.env.API_SECRET;

const corsOptions = {
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

async function main() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const stanConn = BrokerClient(mongoClient);

    const context = {mongoClient, stanConn, secret};

    const api = API(corsOptions, context);
    api.listen(PORT, () =>
      console.log(`Listening at http://localhost:${PORT}`)
    );
  } catch (e) {
    console.dir(e);
  }
}

main();

/*                               */
/* YOU MUST NOT CHANGE THIS FILE */
/*                               */

