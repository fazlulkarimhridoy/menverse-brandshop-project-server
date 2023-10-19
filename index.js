const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config(); 
const port = process.env.PORT || 5000;
const app = express();

// used Middleware
app.use(cors());
app.use(express.json());

// Connact With MongoDb Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.krxly.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Create a async fucntion to all others activity
async function run() {
  try {
    await client.connect();
    // Create Database to store Data
    const testCollection = client.db("testDatabaseName").collection("testData");
  } finally {
    // await client.close();
  }
}
// Call the function you declare abobe
run().catch(console.dir);
// Root Api to check activity
app.get("/", (req, res) => {
  res.send("Hello From NR Computers!");
});
app.listen(port, () => {
  console.log(`NR Computers listening on port ${port}`);
});
