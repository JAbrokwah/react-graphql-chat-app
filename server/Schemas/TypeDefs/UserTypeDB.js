const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    //we can choose to require some fields
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
}
);

module.exports = mongoose.model("User", userSchema);
