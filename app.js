const path = require('path');
require('dotenv').config({path: path.join(__dirname, './.env')})
const express = require('express');
const morganLogger = require('morgan');
const app = express();
const router = require('./routes');
const dbConnector = require('./helpers/database.helper');

const cors = require('cors');
app.use(cors());
app.options('*', cors());

app.use(morganLogger('dev'));

// //middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

dbConnector.init(app);

app.use((req, res, next) => {
    console.log(app.locals.db)
    if (app.locals.db) {
        req.db = app.locals.db;
    }

    next();
});

app.use('/api', router);

//route not found error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });
  
  //global error handler thrown in next
  app.use((error, req, res, next) => {
    return res.status(error.status || 500).json({
      error:{
        message: error.message
      }
    });
})

module.exports = app;