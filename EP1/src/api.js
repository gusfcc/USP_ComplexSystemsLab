const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

module.exports = function (corsOptions, { stanConn, mongoClient, secret }) {
  const api = express();

  api.use(express.json());
  api.use(cors(corsOptions));

  api.get("/", (req, res) => res.json("Hello, World!"));

  /* ******************* */
  /* YOUR CODE GOES HERE */
  /* ******************* */

  return api;
};
