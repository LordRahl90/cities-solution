"use strict";

const https = require("https");
const Calculator = require("./calculator");

class Cities {
  citiesMap = new Map();
  cityTags = new Map();
  resultMap = new Map();
  calculator = new Calculator();
  requestStatus = {};

  constructor(endpoint) {
    https.get(endpoint, (response) => {
      const chunk = [];
      response.on("data", (data) => {
        chunk.push(data);
      });
      response.on("end", () => {
        const jsonData = JSON.parse(Buffer.concat(chunk).toString());
        jsonData.map((c) => {
          this.citiesMap.set(c.guid, c);
          c.tags.map((t) => {
            if (!this.cityTags.has(t)) {
              this.cityTags.set(t, [c.guid]);
              return;
            }
            this.cityTags.get(t).push(c.guid);
          });
        });
      });
    });
  }

  getByTag(res, tag, isActive) {
    if (!this.cityTags.has(tag)) {
      res.status(404).json({ error: "cannot find tag: " + tag });
      return;
    }
    const result = this.cityTags
      .get(tag)
      .map((i) => {
        return this.citiesMap.get(i);
      })
      .filter((v) => {
        return v.isActive + "" === isActive;
      });

    res.status(200).json({ cities: result });
  }

  calculateDistance(from, to) {
    const fromCity = this.citiesMap.get(from);
    const toCity = this.citiesMap.get(to);

    const result = this.calculator.distance(
      fromCity.latitude,
      toCity.latitude,
      fromCity.longitude,
      toCity.longitude
    );

    return result;
  }

  allCities(res) {
    this.requestStatus.expectedID = "pending";
    res.write("[");
    let i = 0;
    const mapSize = this.citiesMap.size;
    this.citiesMap.forEach((v) => {
      if (mapSize - i > 1) {
        res.write(JSON.stringify(v) + ",\n");
      } else {
        res.write(JSON.stringify(v));
      }
      i++;
    });
    res.write("]");
    res.status(200).end();
  }

  // retrieve all the cities that are within the given distance
  citiesByDistance(from, distance, requestID) {
    this.requestStatus.requestID = "pending";
    this.citiesMap.forEach((cm) => {
      const result = this.calculateDistance(from, cm.guid);
      const actual = parseFloat(result.toFixed(2));
      if (actual > parseFloat(distance) || cm.guid === from) {
        return;
      }
      if (!this.resultMap.has(requestID)) {
        this.resultMap.set(requestID, [cm]);
        return;
      }
      this.resultMap.get(requestID).push(cm);
      return;
    });
    this.requestStatus.requestID = "done";
  }

  // retrieve all the responses from the result
  distanceResponse(id) {
    if (this.resultMap.id === "pending") {
      return "pending";
    }
    return this.resultMap.get(id);
  }
}
module.exports = Cities;
