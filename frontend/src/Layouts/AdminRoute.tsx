import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Contexts/AuthContext"
import { memo } from "react";



const AdminRoute = ({children} : {children : React.ReactNode}) => {

    const {user} = useAuthContext();

    if(!user || user.role !== "ADMIN"){
       return <Navigate to="/" replace/>
    }

    return <>{children}</>
}


export default memo(AdminRoute);