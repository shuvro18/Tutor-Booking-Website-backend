const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()

dotenv.config()

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


//Mongo URI
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const  run = async ()=> {
  try {
    await client.connect();
    const db = client.db("tutor-booking-a9");
    const userCollection = db.collection("users");


    //get api
    app.get("/users", async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.dir(err);
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
