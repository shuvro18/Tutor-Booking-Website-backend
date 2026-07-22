const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

dotenv.config();

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
  },
});

const run = async () => {
  try {
    await client.connect();
    const db = client.db("tutor-booking-a9");
    const userCollection = db.collection("users");
    const bookingCollection = db.collection("bookings");

    //get api
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get single data
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    //create a user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //get my tutors page
    app.get("/my-tutors/:createdBy", async (req, res) => {
      const { createdBy } = req.params;
      const result = await userCollection
        .find({ createdBy: createdBy })
        .toArray();
      res.send(result);
    });

    //delete my tutors
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //update user
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id),
      };
      const modifiedTutor = req.body;
      const updateTutor = {
        $set: {
          tutorName: modifiedTutor.tutorName,
          photoUrl: modifiedTutor.photoUrl,
          subject: modifiedTutor.subject,
          hourlyFee: modifiedTutor.hourlyFee,
          totalSlot: modifiedTutor.totalSlot,
          startDate: modifiedTutor.startDate,
          institution: modifiedTutor.institution,
          experience: modifiedTutor.experience,
          location: modifiedTutor.location,
          teachingMode: modifiedTutor.teachingMode,
          availableTime: modifiedTutor.availableTime,
        },
      };
      const result = await userCollection.updateOne(filter, updateTutor);
      res.send(result);
    });

    //booking post api
    app.post("/booking", async (req, res) => {
      const newUser = req.body;
      const result = await bookingCollection.insertOne(newUser);
      res.send(result);
    });

    //booking get api
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.find({ userId: id }).toArray();
      res.send(result);
    });

    // booking delete api
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;  
      console.log(id)    
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.dir(err);
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
