const assert = require("assert");
const Calculator = require("../../../src/services/calculator");

describe("should perform distance calculation", () => {
  it("should calculate the distance between given points", () => {
    const calculator = new Calculator();

    const lat1 = -1.409358;
    const long1 = -37.257104;
    const lat2 = 46.965565;
    const long2 = -172.744857;

    const result = calculator.distance(lat1, lat2, long1, long2);
    console.log(result);
  });
});
