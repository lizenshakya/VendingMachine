"use strict";

const { expect } = require("chai");
const request = require('supertest');
const sinon = require('sinon');
const moduleConfig = require('../../../../modules/vending-machine/config/config')
const app = require('../../../../app.js');

describe("[Buy PRODUCT INFO] Buy Product info of the system", function() {
    const sandbox = sinon.createSandbox({
        injectInto: null,
        properties: ['spy', 'stub', 'mock'],
        useFakeTimers: false,
        useFakeServer: false
    });
    
  describe("Buy product validation fail", function() {
    it("should return validation response", function(done) {
      try {
        request(app).post('/api/vending-machine/buy').
        send({  })
        .then((res) => {
          const body = res.body;
          expect(body.errors).to.be.an('array');
          expect(body.message).to.equals(moduleConfig.message.validationError);
          expect(body.statusCode).to.equals(403); 

          done();
        }).catch(err => done(err))
      } catch (err) {
        console.log("[Error:::] => ", err.stack);
        done();
      }
        });
    });
    

    describe("Buy product success", function() {
        afterEach(() => {
            sandbox.restore();
          });
        beforeEach(function() {
            this.sandbox = sinon.createSandbox();
          });
        
        const stubValue = {
            productName: 'Coke', 
            productQuantity: 1, 
            amount: 100
        }

        it("should return success response", function(done) {
          try {
            request(app).post('/api/vending-machine/buy').
            send(stubValue)
            .then((res) => {
              const body = res.body;
              expect(body.data).to.be.an('object');
              expect(body.message).to.equals(moduleConfig.message.productSelected);
              expect(body.statusCode).to.equals(200);
              expect(body.data).to.have.an.own.property("change"); 
              expect(body.data).to.have.an.own.property("productName"); 
              expect(body.data).to.have.an.own.property("productPrice"); 
              expect(body.data).to.have.an.own.property("productQuantity"); 

    
              done();
            }).catch(err => done(err))
          } catch (err) {
            console.log("[Error:::] => ", err.stack);
            done();
          }
        });
    });
  
});