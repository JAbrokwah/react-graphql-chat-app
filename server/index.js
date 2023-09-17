const express = require("express");
const app = express();
const PORT = 1010;
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schemas/index");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DB;

app.use(cors());
app.use(express.json());
app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@graphqlchatapp.zmq2oqj.mongodb.net/`)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server running on 1010");
        });
    })
    .catch(err => {
        //we could add some logic for retries here
        console.log(err);
    });