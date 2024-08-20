const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const resetCode = new mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    user: {
        type: ObjectId,
        ref: "usermodel",
        require: true
    }
});

const ResetCodeModel = mongoose.model("Code", resetCode);

module.exports = ResetCodeModel