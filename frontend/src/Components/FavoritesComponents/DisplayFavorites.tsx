import { memo } from "react"
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";
import QuoteCard from "../QuoteComponents/QuoteCard";
import EventComponent from "../EventsComponents/EventComponent";
import FigureCard from "../FiguresComponents/FigureCard";




const DisplayFavorites = () => {

    const {savedQuotes, savedEvents, savedFigures, typeToShow} = useSavedItemsContext();



    return(
         <div className="flex flex-col justify-center items-center mt-10 gap-5">
              <h3 className="font-semibold text-gray-900 text-center text-[17px]">
                {typeToShow === "Quotes" ?
                   "Words of wisdom that have stood the test of time."  : 
                   typeToShow === "Events" ?
                       "Discover the moments that changed the course of history."
                       : 
                         "Meet the minds and leaders who left their mark on the world."
                }
              </h3>

              {
                typeToShow === "Quotes" ?
                  <>
                    {savedQuotes.length === 0 
                      ?
                        <p>
                            No Quotes Saved
                        </p>
                        : 
                          <div className="flex flex-wrap w-full px-5 items-start justify-center gap-5">
                             {savedQuotes.map((q)=>{
                                return(
                                    <QuoteCard quote={q} key={q._id}/>
                                )
                             })}
                          </div>
                    }
                  </>
                  : 
                    typeToShow === "Events" ?
                       <>
                         {savedEvents.length === 0 ?
                            <p>
                                No Events Saved
                            </p>
                            : 
                            <div className="flex flex-wrap w-full px-5 items-start justify-center">
                             {savedEvents.map((e)=>{
                                return(
                                     <EventComponent event={e} key={e._id}/>
                                )
                              })}
                          </div>
                        }
                       </>
                       : typeToShow === "Figures" &&
                         
                            <>
                         {savedFigures.length === 0 ?
                            <p>
                                No Figures Saved
                            </p>
                            : 
                            <div className="flex flex-wrap w-full px-5 items-start justify-center">
                             {savedFigures.map((f)=>{
                                return(
                                     <FigureCard figure={f} key={f._id}/>
                                )
                              })}
                          </div>
                        }
                       </>

              }
         </div>
    )
}

export default memo(DisplayFavorites);