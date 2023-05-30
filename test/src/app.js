const assert = require("assert");
const request = require("supertest");
const app = require("../../src/app");

describe("integration tests", () => {
  it("should fail without bearer token", () => {
    request(app)
      .get("/cities-by-tag?tag=excepteurus&isActive=true")
      .expect(401)
      .end((err, res) => {
        assert.equal(true, err === null);
        assert.equal(`{"error":"token not provided"}`, res.text);
      });
  });

  it("should return fail with invalid token", () => {
    request(app)
      .get("/cities-by-tag?tag=excepteurus&isActive=true")
      .set("Authorization", "bearer dGhlc2VjcmV0dG9rZW4=mm")
      .expect(401)
      .end((err, res) => {
        assert.equal(true, err === null);
        assert.equal(`{"error":"Invalid character"}`, res.text);
      });
  });

  it("should return result-url", () => {
    request(app)
      .get("/area?from=ed354fef-31d3-44a9-b92f-4a3bd7eb0408&distance=250")
      .set("Authorization", "bearer dGhlc2VjcmV0dG9rZW4=")
      .expect(202)
      .end((err, res) => {
        assert.equal(true, err === null);
        const result = JSON.parse(res.text);
        assert.strictEqual("request recieved and processing", result.message);
      });
  });
});
