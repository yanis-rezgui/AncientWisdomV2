


const isAdmin = (req, res, next) => {

    if(!req.user){
        return res.status(404).json({
            message: "Unauthorized user not authentificated"
        });
    }

    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
            message : "Forbidden -admin access only"
        });
    }

    next();
}

export default isAdmin;