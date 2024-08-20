const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema

const postModel = new mongoose.Schema({
    type: {
        type: String,
        enum: ["pofilePicture", "cover", null],
        default: null
    },
    images: {
        type: Array
    },
    text: {
        type: String
    },
    background: {
        type: String
    },
    user: {
        type: ObjectId,
        ref: "usermodel"
    },
    comments: [
        {
            comment: {
                type: String
            },
            image: {
                type: String
            },
            commentBy: {
                type: ObjectId,
                ref: "usermodel"
            },
            createdAt: {
                type: Date,
                require: true
            }
        }
    ]
}, {timestamps: true})

const Post = mongoose.model("postData", postModel)

module.exports = Post