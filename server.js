// DEPENDENCIES

// GET .ENV VARIABLES
require("dotenv").config()

// pulling port --- if it doesnt pull it will automatically give it 3000
const { PORT = 3000, MONGODB_URL } = process.env

// import express
const express = require("express")

// our express app object
const app = express()

// import express
const mongoose = require("mongoose")

// import cors
const cors = require("cors")

// important morgan
const morgan = require("morgan")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from mongo"))
.on("error", (error) => console.log(error))


// ------------ MODELS

const PeopleSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    title: String
})

const People = mongoose.model("People", PeopleSchema)




// ------------ MIDDLEWARE

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())



// ------------- ROUTES

// test route
app.get("/", (req, res) => {
    res.send("hello world")
})

// index
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch(error){
        res.status(400).json(error)
    }
})

// create
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// update
app.put("/people/:id", async (req, res) => {
    try {
        res.json( await People.findByIdAndUpdate(req.params.id, req.body, {new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})

// delete
app.delete("/people/:id", async (req, res) => {
    try {
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

///////////////////////////////
// LISTENER needed to start sever
////////////////////////////////
app.listen(PORT, () => console.log(`listening on port ${PORT}`))