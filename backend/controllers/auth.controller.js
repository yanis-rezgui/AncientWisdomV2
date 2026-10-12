import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import {
    JWT_SECRET,
    JWT_EXPIRES_IN
} from "../config/env.js";



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
                    email,
                    password: hashedPassword
                }
            ],
            { session }
        );

        


        const token = jwt.sign({userId : newUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        await session.commitTransaction();

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


export const getUser = async(req, res, next) => {

    try{

        const userId = req.user._id;

        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).json({
                success : false,
                message : "invalid userId in the request, (middleware level)"
            });
        }

        const existingUser = await User.findById(userId);

        if(!existingUser){
            return res.status(404).json({
                success : false,
                message : "Error user not found"
            });
        }

        const userResponse = {
            _id : existingUser._id,
            firstName : existingUser.firstName,
            lastName : existingUser.lastName,
            email : existingUser.email,
            role : existingUser.role
        }

        return res.status(200).json({
            success : true,
            message : "User fetched successfully",
            data : userResponse
        });

    }catch(err){
        next(err);
    }
}



export const updateMyInfo = async (req, res, next) => {
    try {
        const { firstName, lastName } = req.body;
        const updates = {};

        if (firstName !== undefined) {
            if (typeof firstName !== "string" || !firstName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "First name is required",
                });
            }

            updates.firstName = firstName.trim();
        }

        if (lastName !== undefined) {
            if (typeof lastName !== "string" || !lastName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Last name is required",
                });
            }

            updates.lastName = lastName.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        const newUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
                select: "firstName lastName email role",
            }
        );

        if (!newUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    }
};




export const updateMyPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword1, newPassword2 } = req.body;

        if (
            typeof oldPassword !== "string" ||
            !oldPassword ||
            typeof newPassword1 !== "string" ||
            !newPassword1 ||
            typeof newPassword2 !== "string" ||
            !newPassword2
        ) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        if (newPassword1 !== newPassword2) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(newPassword1)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
            });
        }

        const existingUser = await User.findById(req.user._id)
            .select("+password");

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            existingUser.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        if (oldPassword === newPassword1) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the current password",
            });
        }

        existingUser.password = await bcrypt.hash(newPassword1, 10);

        await existingUser.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        next(err);
    }
};
