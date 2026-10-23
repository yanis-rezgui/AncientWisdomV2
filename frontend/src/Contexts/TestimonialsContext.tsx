import type { Testimonial } from "../Types/Types";
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from "./AuthContext";


interface TestimonialsContextType{
    activeTestimonials : Testimonial[];
    loadingActiveTestimonials : boolean;
    allTestimonials : Testimonial[];
    loadingAllTestimonials : boolean;

    getActiveTestimonials : ()=>Promise<void>;
    getAllTestimonials : ()=>Promise<void>;

    testimonialDetails: Testimonial | null;
    setTestimonialDetails: (testimonial: Testimonial | null) => void;

    showUpdateTestimonialPop : boolean;
    setShowUpdateTestimonialPop : (b : boolean)=>void;
    updateTestimonial : (id : string, testimonial : Testimonial)=>Promise<void>;
    loadingUpdateTestimonial : boolean;

    showAddTestimonialPop : boolean;
    setShowAddTestimonialPop : (b : boolean)=>void;
    loadingAddTestimonial: boolean;
    addTestimonial : (testimonial : Testimonial)=>Promise<void>;

    showDeleteTestimonialPop : boolean;
    setShowDeleteTestimonialPop : (b : boolean)=>void;
    loadingDeleteTestimonial : boolean;
    deleteTestimonial : (id : string)=>Promise<void>;


}

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/testimonials`;

const TestimonialsContext = createContext<TestimonialsContextType | null>(null);

export const TestimonialsProvider = ({children} : {children : React.ReactNode}) => {

    const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>([]);
    const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);

    const [loadingActiveTestimonials, setLoadingActiveTestimonials] = useState<boolean>(false);
    const [loadingAllTestimonials, setLoadingAllTestimonials] = useState<boolean>(false);

    const [loadingUpdateTestimonial, setLoadingUpdateTestimonial] = useState<boolean>(false);
    const [loadingAddTestimonial, setLoadingAddTestimonial] = useState<boolean>(false);

    const [showUpdateTestimonialPop, setShowUpdateTestimonialPop] = useState<boolean>(false);
    const [showAddTestimonialPop, setShowAddTestimonialPop] = useState<boolean>(false);

    const [testimonialDetails, setTestimonialDetails] =
    useState<Testimonial | null>(null);

    const [showDeleteTestimonialPop, setShowDeleteTestimonialPop] = useState<boolean>(false);
    const [loadingDeleteTestimonial, setLoadingDeleteTestimonial] = useState<boolean>(false);

    const {token} = useAuthContext();

    const getActiveTestimonials = async() => {

        try{
            setLoadingActiveTestimonials(true);

            const res = await fetch(`${API_URL}/active`, {
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting active testimonials");
            }

            setActiveTestimonials(data.data);
            console.log("Active testimonials : ", data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingActiveTestimonials(false);
        }
    }

    const getAllTestimonials = async() => {

        try{

            setLoadingAllTestimonials(true);

            const res = await fetch(API_URL, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting active testimonials");
            }

            setAllTestimonials(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAllTestimonials(false);
        }
    }

    const updateTestimonial = async(id : string, testimonial : Testimonial) => {

        try{

            setLoadingUpdateTestimonial(true);

            const res = await fetch(`${API_URL}/${id}`, {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify(testimonial)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating testimonial");
            }

            setShowUpdateTestimonialPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateTestimonial(false);
        }
    }

    const addTestimonial = async(testimonial : Testimonial) => {

        try{

            setLoadingAddTestimonial(true);

            const res = await fetch(API_URL,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(testimonial)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error adding testimonial")
            }

            setShowAddTestimonialPop(false);
            await getAllTestimonials();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAddTestimonial(false);
        }
    }


    const deleteTestimonial = async(id : string) => {

        try{

            setLoadingDeleteTestimonial(true);

            const res = await fetch( `${API_URL}/${id}`, {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in deleting Testimonial")
            }

            setShowDeleteTestimonialPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingDeleteTestimonial(false);
        }
    }


    useEffect(()=>{
        getAllTestimonials();
        getActiveTestimonials();
    }, []);

    

    return <TestimonialsContext.Provider value={{
       activeTestimonials,
       allTestimonials,
       loadingActiveTestimonials,
       loadingAllTestimonials,
       getActiveTestimonials,
       getAllTestimonials,

       addTestimonial,
       showAddTestimonialPop,
       setShowAddTestimonialPop,
       loadingAddTestimonial,
       loadingUpdateTestimonial,
       updateTestimonial,
       setShowUpdateTestimonialPop,
       showUpdateTestimonialPop,
       testimonialDetails,
       setTestimonialDetails,

       deleteTestimonial,
       showDeleteTestimonialPop,
       setShowDeleteTestimonialPop,
       loadingDeleteTestimonial
       
       
    }}>
        {children}
    </TestimonialsContext.Provider>
}


export const useTestimonialsContext = () => {

    const context = useContext(TestimonialsContext);

    if(!context){
        throw new Error("Please use the useTestimonialsContext type inside the TestimonialsProvider");
    }

    return context;
}
