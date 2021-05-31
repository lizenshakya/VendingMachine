async function showAvatar() {
   
    require('dotenv').config({path: '../.env'})
    const Promise = require('bluebird');
    const mongodb = Promise.promisifyAll(require('mongodb'));
    const MongoClient = mongodb.MongoClient;
    let db;
    const client = await MongoClient.connect(
        `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
        {
          useUnifiedTopology: true,
          promiseLibrary: Promise,
          useNewUrlParser: true
        }
      );
      if (client) {
        db = client.db(process.env.DB_NAME);
      }
        const productSeed = await db.collection("productTbl").insertOne({
            "_id":"60b216b0065ffd1cf3bdfd1b",
            "id":"d5bded27-cfaa-4035-b6eb-151abbcf7ab3",
            "initialAmount": 100,
            "soldAmount": 0,
            "productInfo":[{
                "productName":"Coke",
                "initialProductQuantity":10,
                "productPrice": 20,
                "soldProductQuantity": 0,
                "remainingProductQuantity": 10,
                "soldPrice": 0
                
            },{
                "productName":"Pepsi",
                "initialProductQuantity": 10,
                "productPrice": 25,
                "soldProductQuantity": 0,
                "remainingProductQuantity": 10,
                "soldPrice": 0
            },{
                "productName":"Mountain Dew",
                "initialProductQuantity": 20,
                "productPrice": 30,
                "remainingProductQuantity": 20,
                "soldProductQuantity": 0,
                "soldPrice": 0 
                
            }]
            
        });
        console.log(productSeed, "productSeed")
      }
  
  showAvatar();