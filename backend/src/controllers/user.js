import User from "../models/user.js";
import bcrypt from "bcrypt";
import { createToken } from "../services/auth.js";


//creating new user using user model
export const handleCreateNewUser = async (req, res) => {

    try {
        const { username, email, password } =  req.body;

        const user = await User.findOne({ email });
        
        if(user){
            throw new Error("User already exists");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const result = await User.create(newUser);

        if(!result){
            throw new Error("Failed to create new user");
        }

        res.status(201).json({ msg: "Success", _id: result._id });
        console.log("Success: new user created", result.id);
        return;

    } catch (error) {
        res.status(500).json({msg: `Error creating new user- ${error.message}`});
    }
    




};  

//logging in to existing user account and creating a token
//on successful login
export const handleLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // console.log(email, password);

        const user = await User.findOne({ email });

        console.log("user--", user);        

        if(!user){
            throw new Error("User does not exist");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            throw new Error("Invalid Password");
        }

        const token = createToken({id: user._id});

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({msg: "Success", _id: user._id});
        return
    } catch (error) {

        console.log(error.message);
        
        res.status(500).json({msg: error.message});
    }
};

//simply clear out the token on logout
export const handleLogout = (req, res) => {
    const token = req.cookies.jwt;

    if(token){
        res.clearCookie("jwt");
        res.status(200).json({msg: "jwt cleared successfully"});
    }else{
        res.status(401).json({ msg: "No token provided", error: "Unauthorized" });
    }
};

//checking if the user is logged in by sending boolean value in response
export const isLoginCheck = (req, res) => {
     try {
        //getting the userId from req object from the middleware
        const userId = req.userId;
    
        console.log("userId from isLoginCheck---", userId);
    
        if(!userId){
            res.status(401).json(false);
            return;
        }
        else{
          res.status(200).json(true);
          return;
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ msg: "Internal server error", error: "InternalServerError" });
      }
};


export const getUserByUserId = async(req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId);
        res.status(200).json({result: user});
        return;
    } catch (error) {
        res.status(500).json({msg: "Failed to fetch user from database"})
    }
};

