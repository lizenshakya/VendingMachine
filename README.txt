## Features

Core features include:

- Get Product Information
- Buy Product
- Refund Product

## Used tech

##steps

-clone the project.
-the .env.example is given copy and rename to .env and fill out the data.
-after setting up the mongo
-insert the following data it is used as default case:
db.productTbl.insert([{
    "_id":"60b216b0065ffd1cf3bdfd1b",
    "id":"d5bded27-cfaa-4035-b6eb-151abbcf7ab3",
    "initialAmount": 100,
    "soldAmount": 0,
    "productInfo":[{
        "productName":"Coke",
        "initialProductQuantity":10,
        "productPrice": 20,
        "soldProductQuantity": 0,
        "remainingProductQuantity": 20,
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
    
}])

#to run the test
- npm run test

#to start the project 
- nodemon start dev


#documentation of api
api is documented on swagger file

