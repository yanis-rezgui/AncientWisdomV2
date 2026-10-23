import { memo } from "react"
import { useTestimonialsContext } from "../Contexts/TestimonialsContext";
import AddTestimonialPop from "../AdminComponents/AdminTestimonialComponents/AddTestimonialPop";
import UpdateTestimonialPop from "../AdminComponents/AdminTestimonialComponents/UpdateTestimonialPop";
import TestimonialCard from "../AdminComponents/AdminTestimonialComponents/TestimonialCard";
import DeleteTestimonialPop from "../AdminComponents/AdminTestimonialComponents/DeleteTestimonialPop";



const AdminTestimonials = () => {

    
    const {setShowAddTestimonialPop, showAddTestimonialPop, showUpdateTestimonialPop, 
        allTestimonials, loadingAllTestimonials, showDeleteTestimonialPop} = useTestimonialsContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-20">

              

                {/* ==================================================
                    TITLE
                ================================================== */}

                    <div className="flex flex-row justify-between items-center max-w-[1000px] w-full mt-10
                    max-[500px]:flex-col max-[500px]:justify-center max-[500px]:gap-2
                    ">
                        <div className="flex flex-col gap-1 max-[500px]:justify-center
                        max-[500px]:items-center
                        ">
                            <h1 className="text-[1.7em] font-semibold text-[#3E3025]">
                                Testimonials
                            </h1>

                            <p className="text-[14px] text-[#7A726A] leading-6 max-[500px]:text-center">
                                
                        Manage the testimonials submitted by users and displayed on the Ancient Wisdom homepage.
                            </p>
                        </div>

                        <button
                        className="bg-[#3E3025] text-white font-semibold text-[13px] p-2 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60

                        "
                        onClick={()=>{
                            setShowAddTestimonialPop(true);
                        }}>
                            Add Testimonial +
                        </button>
                    </div>

                     
                     <div className="flex flex-wrap justify-center mt-10 gap-4 w-full px-5">
    {loadingAllTestimonials ? (
        <p>Loading...</p>
    ) : (
        allTestimonials.map((t) => (
            <TestimonialCard testimonial={t} key={t._id} />
        ))
    )}
</div>

                
            {showAddTestimonialPop && <AddTestimonialPop/>}
            {showUpdateTestimonialPop && <UpdateTestimonialPop/>}
            {showDeleteTestimonialPop && <DeleteTestimonialPop/>}

                
        </section>
    )
}

export default memo(AdminTestimonials);