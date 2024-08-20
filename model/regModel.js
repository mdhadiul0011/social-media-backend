const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;


const userModel = new Schema({
    fName: {
        type: String, 
        require: true,
        trim: true,
        text: true,
    },
    lName: {
        type: String, 
        require: true,
        trim: true,
        text: true,
    },
    userName: {
        type: String, 
        require: true,
        trim: true,
        text: true,
        uniqe: true,
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    cover: {
        type: String,
        trim: true
    },
    bMonth: {
        type: Number,
        require: true,
        trim: true,
    },
    bDay: {
        type: Number,
        require: true,
        trim: true,
    },
    bYear: {
        type: Number,
        require: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    }, 
    friends: [
        {
            type: ObjectId,
            ref: "usermodel"
        }
    ],
    follower: [
        {
            type: ObjectId,
            ref: "usermodel"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "usermodel"
        }
    ],
    request: [
        {
            type: ObjectId,
            ref: "usermodel"
        }
    ],
    search: [
        {
            user: {
                type: ObjectId,
                ref: "usermodel",
                require: true,
                text: true
            },
            createdAt: {
                type: Date,
                require: true
            }
        }
    ],
    details: {
        bio: {
            type: String
        },
        otherName: {
            type: String
        },
        job: {
            type: String
        },
        currentCity: {
            type: String
        },
        workplace: {
            type: String
        },
        college: {
            type: String
        },
        highschool: {
            type: String
        },
        hometown: {
            type: String
        },
        relationship: {
            type: String,
            enum: ["Single", "In a Relationship", "It's Complicated", "Married", "Divorced"]
        },
        instagram: {
            type: String
        }
    },
    savepost: [
        {
            post: {
                type: ObjectId,
                ref: "post"
            },
            savedAt: {
                type: Date,
                require: true
            },
        }
    ]
})

const userDetails = mongoose.model('usermodel', userModel)

module.exports = userDetails;