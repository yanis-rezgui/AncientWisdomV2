import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import mongoose from "mongoose";




export const signUp = async(req, res, next) => {

    const session = await mongoose.startSession();
    try{

        

        session.startTransaction();

        const {firstName, lastName, email, password1, password2} = req.body;

        if(!firstName || firstName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error firstName is required"
            });
        }

        if(!lastName || lastName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error last name is required"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || email.trim() ==="" || !emailRegex.test(email)){
            return res.status(400).json({
                success : false,
                message : "Error email not in correct format"
            });
        }

        const existingUser = await User.findOne({email}).session(session);

        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "Error a user has already been registered with this email",
            });
        }

        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!password1 || !password2 || password1 !== password2){
            return res.status(400).json({
                success : false,
                message : "Error passwords must be the same"
            });
        }

        if(!passwordRegex.test(password1)){
            return res.status(400).json({
                success : false,
                message : "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password1, salt);

        const [newUser] = await User.create(
            [
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: normalizedEmail,
                    password: hashedPassword
                }
            ],
            { session }
        );

        await session.commitTransaction();


        const token = jwt.sign({userId : newUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        const userResponse = {
            _id: newUser._id,
            firstName : newUser.firstName,
            lastName : newUser.lastName,
            email : newUser.email,
            role : newUser.role
        };

        return res.status(201).json({
            success : true,
            message : "User created successfully",
            data : {
                user : userResponse,
                token,
            }
        });

    }catch(err){
        await session.abortTransaction();
        next(err);
    }finally{
        await session.endSession();
    }
}


export const signIn = async(req, res, next) => {

    try{

        const {email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || email.trim() ==="" || !emailRegex.test(email)){
            return res.status(400).json({
                success : false,
                message : "Error email not in correct format"
            });
        }


        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                success : false,
                message: "Error user not found",
            });
        }


        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if(!isValidPassword){
            return res.status(400).json({
                success : false,
                message : "Error invalid password"
            })
        }

        const token = jwt.sign({userId : existingUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        const userResponse = {
            _id : existingUser._id,
            firstName : existingUser.firstName,
            lastName : existingUser.lastName,
            email : existingUser.email,
            role : existingUser.role
        }

        return res.status(200).json({
            success : true,
            message : "User signed in successfully",
            data : {
                user : userResponse,
                token
            }
        });
    }catch(err){
        next(err);
    }
}

export const signOut = async(req , res , next) => {
    try{

        return res.status(200).json({
            success : true,
            message: "User signed out successfully"
        });
    }catch(err){
        next(err);
    }
}