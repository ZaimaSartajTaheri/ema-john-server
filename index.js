const express=require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioamv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app=express();
app.use(cors());
app.use(bodyParser.json());

client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLP);
  const ordersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLO);
  app.post('/addProduct',(req,res)=>{
      const products=req.body;
      //console.log(product);
      productsCollection.insertOne(products)
      .then(result=>{
          //console.log(result);
          res.send(result.insertedCount>0)
      })
  });
  app.get('/products',(req,res)=>{
    productsCollection.find({})
    .toArray((err,document)=>{
        res.send(document);
    })
  });
  app.get('/product/:key',(req,res)=>{
    productsCollection.find({key:req.params.key})
    .toArray((err,document)=>{
        res.send(document[0]);
    })
  });
  app.post('/productsByKeys',(req,res)=>{
      const productKeys=req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })
  });
  app.post('/addOrder',(req,res)=>{
    const order=req.body;
    //console.log(product);
    ordersCollection.insertOne(order)
    .then(result=>{
        //console.log(result);
        res.send(result.insertedCount>0)
    })
});

  
  //console.log("database connected");
});

app.get('/',(req,res)=>{
    res.send('hello');
});
app.listen(3001);