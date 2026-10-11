import uploadOnCloudary from "../config/cloudinary.js";
import genToken from "../config/token.js";
import User from "../model/userModel.js"
import validator from "validator"
import cookieParser from "cookie-parser";



//------------signUP----------
/*
1.input from user
2.email exist
3.email validation
4.password set
5.create user
6.token generate

*/
export const signUp = async(req,res) => {
    try {
        const {userName ,email, password} = req.body
        let photoUrl
        if(req.file){
            photoUrl = await uploadOnCloudary(req.file.path)
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User is already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid email"})
        }
        if(password.length < 8){
            return res.status(400).json({ message: "Enter strong password" });
        }
        const hashPassword = await bcrypt.hash(password,10)
        

        const user = await User.create({
            userName,
            email,
            password:hashPassword,
            photoUrl
        })

        let token = await genToken(user._id)

        res.cookie("token" , token, {
            httpOnly:true,
            secure:false,
            samesite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ message: `SignUp error ${error}` });
    }
}




//---------SignIN----------------
/*
-input from user
-check password
-gen token
*/

export const signIn = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message: "User is not found" });
        }
        const matchPassword = await bcrypt.compare(password , user.password)
        if(!matchPassword){
            return res.status(400).json({ message: "Incorrect Password" });
        }

        let token = await genToken(user._id);

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          samesite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `SignIn error ${error}` });
    }
}



//-------------SignOut---------------

export const signOut = async(req,res) =>{
    try {
        await res.clearCookie("token")
        return res.status(200).json({ message: "SignOut successfully" });
    } catch (error) {
        return res.status(500).json({ message: `SignOut error ${error}` });
    }
}
