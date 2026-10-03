import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";


const authorize = async(req , res , next) => {

    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
        }

        //console.log('Headers Authorization : ', req.headers.authorization);
        //console.log("Token extrait : ", token);

        if(!token) return res.status(401).json({
            message : "Error no token provided"
        });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user){
            return res.status(401).json({
                message : "Unauthorized -User not found"
            });
        }

        req.user = user;
        next();
    
    }catch(err){
        res.status(401).json({
            message : 'Unauthorized -Invalid token',
            error : err.message
        });
    }
}

export default authorize;