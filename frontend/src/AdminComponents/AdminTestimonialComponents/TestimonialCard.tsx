import { memo } from "react";
import type { Testimonial } from "../../Types/Types";
import { useTestimonialsContext } from "../../Contexts/TestimonialsContext";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {

    const { setShowUpdateTestimonialPop, setShowDeleteTestimonialPop, setTestimonialDetails } = useTestimonialsContext();

    return (
        <div className="bg-[#F5F1E8] border border-[#D6CEBF] rounded-lg flex flex-col gap-3 p-4
        w-[260px] max-sm:w-full shadow-sm">

            {/* Name + status */}
            <div className="flex flex-row justify-between items-center gap-2">
                <p className="font-semibold text-[15px] text-[#3E3025] truncate">
                    {testimonial.fullName}
                </p>

                <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0
                    ${testimonial.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"}`}
                >
                    {testimonial.active ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Rating */}
            <p className="text-[#C9A227] text-[14px] tracking-wide">
                {"★".repeat(testimonial.rating)}
                <span className="text-[#D6CEBF]">
                    {"★".repeat(Math.max(0, 5 - testimonial.rating))}
                </span>
            </p>

            {/* Message */}
            <p className="text-[13px] text-[#7A726A] leading-5 line-clamp-4 grow">
                {testimonial.message}
            </p>

            {/* Actions */}
            <div className="flex flex-row gap-2 mt-1">
                <button
                    className="flex-1 bg-[#3E3025] text-white text-[12px] font-semibold py-1.5 rounded-lg
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    onClick={() => {
                        setTestimonialDetails(testimonial)
                        setShowUpdateTestimonialPop(true);
                    
                    }}
                >
                    Update
                </button>

                <button
                    className="flex-1 bg-transparent border border-red-400 text-red-500 text-[12px] font-semibold py-1.5 rounded-lg
                    cursor-pointer transition-colors duration-200 hover:bg-red-50 active:bg-red-100"
                    onClick={() => {
                        setTestimonialDetails(testimonial)
                        setShowDeleteTestimonialPop(true);
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default memo(TestimonialCard);