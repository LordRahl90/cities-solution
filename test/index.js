const assert = require("assert");
require('./src/services/calculator');

describe("Should Add Up", () => {
  it("should add 2+2", () => {
    assert.equal(4, (2+2))
  });
});
