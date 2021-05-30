"use strict";

const { expect } = require("chai");
const request = require('supertest');
const moduleConfig = require('../../../../modules/vending-machine/config/config')
const app = require('../../../../app.js');


describe("[GET PRODUCT INFO] Get Product info of the system", function() {
  describe("Get product success", function() {
    it("should return success response", function(done) {
      try {
        request(app).get('/api/vending-machine')
        .then((res) => {
          const body = res.body;
          expect(body.data).to.be.an('object');
          expect(body.message).to.equals(moduleConfig.message.dataFound);
          expect(body.statusCode).to.equals(200); 

          done();
        }).catch(err => done(err))
      } catch (err) {
        console.log("[Error fro  here] => ", err.stack);
        done();
      }
    });
  });
});