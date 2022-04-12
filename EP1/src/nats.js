const stan = require("node-nats-streaming");

module.exports = function (mongoClient) {
  const conn = stan.connect("test-cluster", "test", {
    url: process.env.BROKER_URL,
  });

  conn.on("connect", () => {
    console.log("Connected to NATS Streaming");

    /* ******************* */
    /* YOUR CODE GOES HERE */
    /* ******************* */
  });

  return conn;
};
