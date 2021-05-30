const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 4001;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kljii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const adminsCollection = client.db("ms_tutorial").collection("makeAdmin");

  app.post("/addAdmin", (req, res) => {
    const adminUser = req.body;
    adminsCollection.insertOne(adminUser).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });

  app.get("/isAdmin", (req, res) => {
    adminsCollection
      .find({ email: req.query.email })
      .toArray((err, docs) => res.send(!!docs.length));
  });

  console.log("db connected!", err);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
