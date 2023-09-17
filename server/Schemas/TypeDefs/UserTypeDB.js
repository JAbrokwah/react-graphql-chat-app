const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    //we can choose to require some fields
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}
);

module.exports = mongoose.model("User", userSchema);
