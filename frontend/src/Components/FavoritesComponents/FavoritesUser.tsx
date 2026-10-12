import { Heart} from "lucide-react"
import { memo } from "react"



const FavoritesUser = () => {



 

    return(
        <div className="flex flex-col justify-center items-center gap-1">
            <div className="text-[#3E3025] text-[1.8em] font-semibold flex flex-row justify-center items-center gap-2
            mt-10
            ">
               <Heart size={35}/> Favorites

            </div>
            
            <p className="text-gray-950 text-[17px] text-center">
                A collection of the historical discoveries that inspired you.
            </p>

            <p className="text-gray-950 text-[17px] text-center">
                Preserve the moments, people, and words that shaped history.
            </p>
            

        </div>
    )
}


export default memo(FavoritesUser);