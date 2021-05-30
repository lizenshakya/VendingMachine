(databaseHelper => {
  'use strict';

  const Promise = require('bluebird');
  const mongodb = Promise.promisifyAll(require('mongodb'));
  const MongoClient = mongodb.MongoClient;

  databaseHelper.init = async (app) => {
    const client = await MongoClient.connect(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
      {
        useUnifiedTopology: true,
        promiseLibrary: Promise,
        useNewUrlParser: true
      }
    );
    if (client) {
      app.locals.db = client.db(process.env.DB_NAME);
      console.log('database connection success');
      return client;
    }
  };
})(module.exports);
