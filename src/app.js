const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const Calculator = require("./services/calculator");

const bearerMW = require("./middlewares/bearer");

const citiesMap = new Map();
const cityTags = new Map();
const calculator = new Calculator();

const endpoint =
  "https://raw.githubusercontent.com/gandevops/backend-code-challenge/master/addresses.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// load all cities to memory
https.get(endpoint, (response) => {
  const chunk = [];
  response.on("data", (data) => {
    chunk.push(data);
  });
  response.on("end", () => {
    const jsonData = JSON.parse(Buffer.concat(chunk).toString());
    jsonData.map((c) => {
      citiesMap.set(c.guid, c);
      c.tags.map((t) => {
        if (!cityTags.has(t)) {
          cityTags.set(t, [c.guid]);
          return;
        }
        cityTags.get(t).push(c.guid);
      });
    });
  });
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong " + Date());
});

app.use(bearerMW);

app.get("/cities-by-tag", (req, res) => {
  const { tag, isActive } = req.query;
  if (!cityTags.has(tag)) {
    res.status(404).json({ error: "cannot find tag: " + tag });
    return;
  }
  const ids = cityTags.get(tag);
  const result = ids
    .map((i) => {
      return citiesMap.get(i);
    })
    .filter((v) => {
      return v.isActive + "" === isActive;
    });
  res.status(200).json({ cities: result });
});
app.get("/distance", (req, res) => {
  const { from, to } = req.query;
  const fromCity = citiesMap.get(from);
  const toCity = citiesMap.get(to);
  const result = calculator.distance(
    fromCity.latitude,
    toCity.latitude,
    fromCity.longitude,
    toCity.longitude
  );
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

app.get("/area", (req, res) => {});

app.get("/area-result/:id", (req, res) => {
  // let id = '2152f96f-50c7-4d76-9e18-f7033bd14428';
  const id = req.params.id;
});

app.get("/all-cities", (req, res) => {
  res.write('[');
  let i = 0;
  const mapSize = citiesMap.size;
  citiesMap.forEach(v=>{
    if(mapSize-i > 1 ){
        res.write(JSON.stringify(v)+',\n');
    }else {
        res.write(JSON.stringify(v));
    }
    i++;
  });
  res.write(']');
  res.status(200).end();
});

module.exports = app;
