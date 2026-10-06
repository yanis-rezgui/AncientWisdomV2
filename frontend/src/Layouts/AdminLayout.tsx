import  { memo } from "react";
import { Outlet } from "react-router-dom"
import AdminHeader from "../AdminComponents/AdminBaseComponents/AdminHeader";




const AdminLayout = () => {



    return(
        <>
        <AdminHeader/>
        <main className="pt-[60px]">
            <Outlet/>
        </main>
        </>
    );
}


export default memo(AdminLayout);