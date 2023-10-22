const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// used Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ibuouo3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // creating database for brands
    const brandCollection = client.db("brandDB").collection("brands");
    // creating database for products
    const productCollection = client.db("productDB")?.collection("products");
    // creating database for cart
    const cartCollection = client.db("cartDB").collection("cartData");

    // get products form mongoDB
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    // get cart product 
    app.get("/carts", async(req, res)=>{
      const cursor = cartCollection.find();
      const cartProducts = await cursor.toArray();
      res.send(cartProducts)
    })

    // app.get("/carts/:id", async(req, res)=>{
    //   const id = req.params.id;
    //   const filter = { _id : new ObjectId(id)};
    //   const result = await cartCollection.findOne(filter);
    //   res.send(result)
    //   console.log(result);
    // })

    // delete from carts
    app.delete("/carts/:id", async(req, res)=>{
      const id = req.params.id;
      const query = { _id : id}
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })

    // post products
    app.post("/addProducts", async (req, res) => {
      const product = req.body;
      const newProduct = await productCollection.insertOne(product);
      res.send(newProduct);
    });

    // post cart data
    app.post("/cartProducts", async(req, res)=>{
      const cartProduct = req.body;
      const newCartProduct = await cartCollection.insertOne(cartProduct);
      res.send(newCartProduct);
    });

    // get products by brand name from mongoDB
    app.get("/allProducts/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brandName: brand };
      const cursor = productCollection.find(query);
      const sortedProducts = await cursor.toArray();
      res.send(sortedProducts);
    });

    // get products details by id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // update product by id
    app.put("/product/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updatedProduct = req.body;
      const product = {
        $set: {
            productName : updatedProduct.productName,
            brandName : updatedProduct.brandName,
            price : updatedProduct.price,
            type : updatedProduct.type,
            rating : updatedProduct.rating,
            image : updatedProduct.image,
            description : updatedProduct.description
        }
      }
      const result = await productCollection.updateOne(filter,product,options);
      res.send(result)
    })

    // getting brand data from mongoDB
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const brand = await cursor.toArray();
      res.send(brand);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root Api to check activity
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});
app.listen(port, () => {
  console.log(`SERVER is running on port ${port}`);
});
