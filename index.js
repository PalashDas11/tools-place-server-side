const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlmyl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const toolsCollection = client.db('tools_place').collection('tools');

    app.get('/tools', async(req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.limit(6).toArray();
      res.send(tools);
    })

  }
  finally{

  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tools place  server ')
});

app.listen(port, () => {
  console.log("crud server is running" ,port);
});
