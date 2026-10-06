import  { memo } from "react"
import { Outlet } from "react-router-dom"
import Header from "../Pages/Header";






const PublicLayout = () => {
     
    return(
        <>
        <Header/>
        <main className="w-full pt-[70px]">
            <Outlet/>
        </main>
     
        </>
    )
}

export default memo(PublicLayout);