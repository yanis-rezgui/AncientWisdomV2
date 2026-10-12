import { memo } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import NoUser from "../Components/FavoritesComponents/NoUser";
import FavoritesUser from "../Components/FavoritesComponents/FavoritesUser";
import FavoritesNavigation from "../Components/FavoritesComponents/FavoritesNavigation";
import DisplayFavorites from "../Components/FavoritesComponents/DisplayFavorites";



const Favorites = () => {

    const {user} = useAuthContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
           {!user 
              ?
              <NoUser/>
              :
              <>
                <FavoritesUser/>
                <FavoritesNavigation/>
                <DisplayFavorites/>
              </>
           }

        </section>
    )
}

export default memo(Favorites);