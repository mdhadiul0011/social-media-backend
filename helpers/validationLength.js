const userDetails = require("../model/regModel");
const userModel = require("../model/regModel");

const validationLength = (text, min, max)=> {
    if(text.length < min || text.length > max){
        return false
    }
    else{
        return true
    }
}

module.exports = validationLength

const validateUsername = async (userName)=>{
    let isTrue = false

    do {
        let user = await userModel.findOne({userName})
        if(user){
            userName += (+ new Date() * Math.random()).toString().substring(0,1)
            isTrue = true
        }
        else{
            isTrue = false
        }
    } while (isTrue);

    return userName;
}

module.exports = validateUsername;