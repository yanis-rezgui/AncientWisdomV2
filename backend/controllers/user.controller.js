import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"



export const getAllUsers = async (req, res, next) => {
    try {
        const {
            search,
            role,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (search && search.trim() !== "") {
            const searchRegex = {
                $regex: search.trim(),
                $options: "i"
            };

            filter.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { role: searchRegex }
            ];
        }

        if (role && ["USER", "ADMIN"].includes(role)) {
            filter.role = role;
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber)
            }
        });
    } catch (err) {
        next(err);
    }
};

export const addUser = async(req, res, next) => {

    try{

        const {firstName, lastName, email, role, password1, password2} = req.body;

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

        if(!role || !["USER", "ADMIN"].includes(role)){
            return res.status(200).json({
                success : false,
                message : "Error invalid role"
            });
        }

        const existingUser = await User.findOne({email});

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

        const newUser = await User.create({
            firstName : firstName.trim(),
            lastName : lastName.trim(),
            email,
            role,
            password : hashedPassword
        });

        return res.status(201).json({
            success : true,
            message : "User created successfully",
        });
    }catch(err){
       next(err);
    }
}


export const updateUser = async(req, res, next) => {

    try{

        const userId = req.params.id;

        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).json({
                success : false,
                message : "Error invalid object id"
            });
        }

        const existingUser = await User.findById(userId);

        if(!existingUser){
            return res.status(404).json({
                success : false,
                message : "Error user not found"
            });
        }

        const {firstName, lastName, email, role} = req.body;

        const updates = {}

        if(firstName !== undefined){
            if(!firstName || firstName.trim() === ""){
            return res.status(400).json({
                success: false,
                message : "Error firstName is required",
            });
            }

            updates.firstName = firstName.trim();

        }

    
        if(lastName !== undefined){
            if(!lastName || lastName.trim() === ""){
            return res.status(400).json({
                success: false,
                message : "Error lastName is required",
            });
            }

            updates.lastName = lastName.trim();

        }
      
        if(email !== undefined){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!email || email.trim() ==="" || !emailRegex.test(email)){
                return res.status(400).json({
                    success : false,
                    message : "Error email not in correct format"
                });
            }

            updates.email = email;
        }

        if(role !== undefined){

            if(!role || !["USER", "ADMIN"].includes(role)){
               return res.status(400).json({
                success : false,
                message : "Error invalid role"
               });
            }

            updates.role = role;
        }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success : true,
            message : "User updated successfully",
            data: updatedUser
        });

    }catch(err){
        next(err);
    }
}


export const deleteUser = async(req , res , next) => {

    try{

        const userId = req.params.id;

        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).json({
                success : false,
                message : "Error invalid userId"
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
            return res.status(404).json({
                success : false,
                message  : "Error user not found"
            })
        }

        return res.status(200).json({
            success: true,
            message : "User deleted successfully"
        });
    }catch(err){
        next(err);
    }

}