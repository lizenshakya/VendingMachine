"use strict";
const express = require('express');
const expect = require('chai').expect;
const request = require('supertest');
const path = require("path");
require('dotenv').config({path: '../../.env'});
const app = express();
const databaseHelper = require("../../helpers/database.helper");

describe("Starting vending machine", async () => {
  before(async () => {
    await databaseHelper.init(app);
    app.use((req, res, next) => {
      if (app.locals.db) {
          req.db = app.locals.db;
      }
  
      next();
  });
  });
  after(function () {
  });

  describe("Product Module", function () {
    require("./vending-machine/methods/getProductInfo.spec");
    require("./vending-machine/methods/buyProductInfo.spec");

  });
});
