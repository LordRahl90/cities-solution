const assert= require('assert');
const request =require('supertest');
const app = require('../../src/app');

describe('integration tests', ()=>{
    it('should fail without bearer token', ()=>{
        request(app)
        .get('/cities-by-tag?tag=excepteurus&isActive=true')
        .expect(401)
        .end((err, res)=>{
            assert.equal(true,err===null);
            assert.equal(`{"error":"token not provided"}`, res.text);
        });
    });

    it('should return fail with invalid token', ()=>{
        request(app)
        .get('/cities-by-tag?tag=excepteurus&isActive=true')
        .set('Authorization','bearer dGhlc2VjcmV0dG9rZW4=mm')
        .expect(401)
        .end((err, res)=>{
            assert.equal(true,err===null);
            assert.equal(`{"error":"Invalid character"}`, res.text);
        });
    });

    it('should return cities with token', ()=>{
        request(app)
        .get('/cities-by-tag?tag=excepteurus&isActive=true')
        .set('Authorization','bearer dGhlc2VjcmV0dG9rZW4=')
        .expect(200)
        .end((err, res)=>{
            console.log(err);
            assert.equal(true,err===null);
            console.log(res.text);
            // assert.equal(`{"error":"token not provided"}`, res.text);
        });
    });
});