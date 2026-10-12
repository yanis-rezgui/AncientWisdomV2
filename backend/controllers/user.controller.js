import User from "../models/user.model.js";
import bcrypt from "bcrypt"



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

