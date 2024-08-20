const userDetails = require("../../model/regModel");
const bcrypt = require('bcrypt');
const validateEmail = require("../../helpers/validateEmail");
const validationLength = require("../../helpers/validationLength");
const validateUsername = require("../../helpers/validationLength");
const sendVerificationMail = require("../../helpers/mailer");
const jwt = require("jsonwebtoken");
const jwtToken = require("../../helpers/usertoken");
const { generateCode } = require("../../helpers/codegenerator");
const ResetCodeModel = require("../../model/resetcodemodel");
const sendResetCode = require("../../helpers/codeMailer");

// ====================regController=======================
exports.regController = async (req, res) => {
    try {
        const {fName, lName, userName, email, password, bDay, bMonth, bYear, gender, verified, } = req.body;

        if(!validateEmail(email)){
            return res.status(400).json({message: "Invalid Email"})
        }

        const checkMail = await userDetails.findOne({email: email})

        if(checkMail){
            return res.status(400).json({mesage: "Email Already Exist"})
        }


        if(!validationLength(fName, 2, 15)){
            return res.status(400).json({message: "First Name should be minimum 2 and maximum 25 characters"})
        }

        
        if(!validationLength(lName, 2, 15)){
            return res.status(400).json({message: "Last Name should be minimum 2 and maximum 25 characters"})
        }

        if(!validationLength(password, 6, 15)){
            return res.status(400).json({message: "Password should be minimum 6 and maximum 25 characters"})
        }

        const bcryptpass = await bcrypt.hash(password, 10);

        let tempusername = fName + lName;
        let finalUserName = await validateUsername(tempusername)

        const user = new userDetails({
            fName,
            lName,
            userName: finalUserName,
            email,
            password: bcryptpass,
            bDay,
            bMonth,
            bYear,
            gender,
            verified,
        })
        await user.save()

        const emailToken = jwtToken({id: user._id.toString()}, "1h")
        
        const url = `${process.env.BASE_URL}/activate/${emailToken}`
        sendVerificationMail(user.email, user.fName, url)

        const token = jwtToken({id: user._id.toString()}, "30d")


       return res.send({
            id: user._id,
            userName: user.userName,
            profilePicture: user.profilePicture,
            fName: user.fName,
            lName: user.lName,
            token: token,
            verified: user.verified,
            message: "Registration Successful! Please active your email to start"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}



// =====================loginController====================
exports.logincontroller = async (req, res) => {
    try {
        const {email, password} = req.body;

        const users = await userDetails.findOne({email: email});
        if(!users){
            return res.status(400).json({
                message: "The email not found"
            })
        }
        const check = await bcrypt.compare(password, users.password)
        if(!check){
            return res.status(400).json({
                message: "Password not Match"
            })
        }
        const token = jwtToken({id: users._id.toString()}, "30d")
        res.send({
            id: users._id,
            fName: users.fName,
            lName: users.lName,
            userName: users.userName,
            profilePicture: users.profilePicture,
            token: token,
            verified: users.verified,
            message: "Login Successful!"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// =============verifiedController=======================
exports.verifiedcontroller = async (req, res) => {
    try {
        const {token} = req.body;
        const users = jwt.verify(token, process.env.SECRET_TOKEN_PASS)
        const check = await userDetails.findById(users.id);
        console.log("User ==>", users);

        // if(check.verified !== users.id){
        //     return res.status(404).json({
        //         message: "You Are a Hacker. You don't have Athorization to complete this opreration"
        //     })
        // }

        if(check.verified === true){
            return res.status(400).json({
                message: "This email is already verified"
            })
        }
        else{
            await userDetails.findByIdAndUpdate(users.id, {verified: true})
            return res.status(200).json({
                message: "Account has been activated successfully"
            })
        }

    } catch (error) {
       return res.json({
            message: error.message
        })
    }
}

// =================reverifiedController=================
exports.reVerification = async (req, res) => {
    try {
        
        const id = req.user.id
        const user = await userDetails.findById(id);
    
        if(user.verified === true) {
           return res.status(404).json({
                 message: "Account has been already activated"
            })
        }

        const emailToken = jwtToken({id: user._id.toString("")}, "1h")
        const url = `${process.env.BASE_URL}/activate/${emailToken}`
        sendVerificationMail(user.email, user.fName, url)

        return res.status(200).json({
            message: "Email verification link has been sent to your account"
        })

    } catch (error) {
       return res.status(400).json({
            message: error.message
        })
    }
}

// =================reset password controller=================
exports.findUser = async (req, res)=> {
    try {
        const  {email} = req.body;
        const matchemail = await userDetails.findOne({email}).select("-password")
        if(!matchemail){
            return res.status(400).json({
                message: "Email does not exist"
            })
        }

        return res.status(200).json({
            email: matchemail.email,
            profilePicture: matchemail.profilePicture
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
// ===========codeGenerator===============
exports.resetCode = async (req, res) =>{
    try {
        const {email} = req.body;
        const user = await userDetails.findOne({email}).select("-password");

        await ResetCodeModel.findOneAndDelete({user: user._id});
        let code = generateCode(5);
        const saveCode = await new ResetCodeModel({
            user: user._id,
            code
        })
        saveCode.save()
        sendResetCode(user.email, user.fName, code)
        return res.status(200).json({
            message: "Reset code has been sent to your email "
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
// ===========verify reset code=============
exports.verifyCode = async (req, res) => {
    try {
        const {email, code} = req.body;
        const user = await userDetails.findOne({email})
        const decode = await ResetCodeModel.findOne({user: user._id})

        if(decode.code !== code){
            return res.status(404).json({
                message: "Code does not matched"
            })
        }
        return res.status(200).json({
            message: "Thank You!"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// ============change password ===============
exports.changepassword = async (req, res) => {
    try {
        const {email, password} = req.body;
        const cryptedPass = await bcrypt.hash(password, 10)
        await userDetails.findOneAndUpdate({email}, {password: cryptedPass})
        return res.status(200).json({
            message: "Successfully change your password"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}