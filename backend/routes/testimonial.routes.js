import { Router } from "express";
import { addTestimonial, deleteTestimonial, getActiveTestimonials, getTestimonials, updateTestimonial } from "../controllers/testimonial.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const testimonialRouter = new Router();


testimonialRouter.get('/active', getActiveTestimonials);

testimonialRouter.get('/', authorize, isAdmin, getTestimonials)

testimonialRouter.put('/:id', authorize, isAdmin, updateTestimonial);

testimonialRouter.post('/', authorize, isAdmin, addTestimonial);

testimonialRouter.delete('/:id', authorize, isAdmin, deleteTestimonial);

export default testimonialRouter;