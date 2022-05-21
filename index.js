const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())






// run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tools place  server ')
});

app.listen(port, () => {
  console.log("crud server is running" ,port);
});
