const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

const Cities = require("./services/cities");
const bearerMW = require("./middlewares/bearer");

const endpoint =
  "https://raw.githubusercontent.com/gandevops/backend-code-challenge/master/addresses.json";
const app = express();
const cities = new Cities(endpoint);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bearerMW);

app.get("/cities-by-tag", (req, res) => {
  const { tag, isActive } = req.query;
  console.log("loading");
  return cities.getByTag(res, tag, isActive);
});

app.get("/distance", (req, res) => {
  const { from, to } = req.query;
  const result = cities.calculateDistance(from, to);
  res.status(200).json({
    from: {
      guid: from,
    },
    to: {
      guid: to,
    },
    unit: "km",
    distance: parseFloat(result.toFixed(2)),
  });
});

app.get("/area", (req, res) => {
  const { from, distance } = req.query;

  // this wil be auto-generated and sent to the client
  let requestID = "2152f96f-50c7-4d76-9e18-f7033bd14428";

  const resultURL = `${req.protocol}://${req.header(
    "host"
  )}/area-result/${requestID}`;
  res.status(202).send({
    resultsUrl: resultURL,
    message: "request recieved and processing",
  });
  cities.citiesByDistance(from, distance, requestID);
});

app.get("/area-result/:id", (req, res) => {
  const id = req.params.id;
  const result = cities.distanceResponse(id);
  if (result === "pending") {
    res.status(202).send({ message: "pending" });
    return;
  }
  res.status(200).send({ cities: result });
});

app.get("/all-cities", (req, res) => {
  return cities.allCities(res);
});

module.exports = app;
