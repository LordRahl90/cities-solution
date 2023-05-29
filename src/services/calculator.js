"use strict";

class Calculator {
  distance(lat1, lat2, long1, long2) {
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;
    long1 = (long1 * Math.PI) / 180;
    long2 = (long2 * Math.PI) / 180;

    const a =
      Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.pow(Math.sin((long2 - long1) / 2), 2);

    const b = 2 * Math.asin(Math.sqrt(a));
    const radius = 6371.0;

    return b * radius;
  }
}

module.exports = Calculator;
