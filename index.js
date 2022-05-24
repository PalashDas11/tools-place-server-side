const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlmyl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}
async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db('tools_place').collection('tools');
    const ordersCollection = client.db('tools_place').collection('orders');
    const usersCollection = client.db('tools_place').collection('users');

    app.get('/tools', async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.limit(6).toArray();
      res.send(tools);
    })

    // // put user 
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const user = req.body;
      const filter = { email: email };
      console.log(filter);
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      res.send({ result, token });

    })

    // get single tool 
    app.get('/toolDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toolsCollection.findOne(query);
      res.send(result);
    })
    // get 
    app.get('/purchase/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toolsCollection.findOne(query);
      res.send(result);
    })
    // get order 
    app.get('/order', verifyJWT, async (req, res) => {
      const order = req.query.customerEmail;
      const decodedEmail = req.decoded.email;
      if (order === decodedEmail) {
        const query = { customerEmail: order }
        const orders = await ordersCollection.find(query).toArray();
        return res.send(orders)
      }
      else{
        return res.status(403).send({ message: 'Forbidden access' })
      }


    })
    // post data on order collection 
    app.post('/order', async (req, res) => {
      const oderProduct = req.body;
      const query = { productName: oderProduct.productName };
      const exists = await ordersCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, order: exists })

      }
      else {
        const result = await ordersCollection.insertOne(oderProduct);
        return res.send({ seccess: true, result })
      }

    })

  }
  finally {

  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running tools place  server ')
});

app.listen(port, () => {
  console.log("crud server is running", port);
});
