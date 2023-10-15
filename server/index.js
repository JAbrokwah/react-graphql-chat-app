const express = require("express");
const app = express();
const PORT = 1010;
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schemas/index");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
dotenv.config();

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DB;

async function verify(client_id, jwtToken) {
    const client = new OAuth2Client(client_id);
    // Call the verifyIdToken to
    // varify and decode it
    const ticket = await client.verifyIdToken({
        idToken: jwtToken,
        audience: client_id,
    });
    // Get the JSON with all the user info
    const payload = ticket.getPayload();
    // This is a JSON object that contains
    // all the user info
    return payload;
}

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // You may need to set this based on your use case
}));
app.use(express.json());
app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.use("/user", graphqlHTTP({
    schema,
    graphiql: false,
}));

// Create a new endpoint to handle the data sent from the client
app.post('/google-auth', async (req, res) => {
    try {
        const { clientId, credential } = req.body; // Assuming you are sending the data in the request body
        const payload = await verify(clientId, credential);
        // Here you can process the `payload` or send a response back to the client as needed
        res.json({ success: true, payload });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred in trying to process google auth' });
    }
});

//`mongodb+srv://${mongoUser}:${mongoUser}@graphqlchatapp.zmq2oqj.mongodb.net/`

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@graphqlchatapp.zmq2oqj.mongodb.net/${mongoDBName}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server running on 1010");
        });
    })
    .catch(err => {
        //we could add some logic for retries here
        console.log(err);
    });

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
});