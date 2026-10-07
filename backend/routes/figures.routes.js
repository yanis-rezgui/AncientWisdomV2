import { Router } from "express";
import { getFiguresOptions, getHistoricalFigure, getHistoricalFigures } from "../controllers/historicalFigure.controller.js";
import multer from "multer";
import { addFigure, deleteFigure, updateFigure } from "../controllers/figure.admin.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";



const figuresRouter = new Router();

const storage = multer.memoryStorage();


const upload = multer({

    storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
            "image/avif"
        ];


        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, AVIF, and WEBP are allowed."
                )
            );

        }

    }

});


figuresRouter.get('/', getHistoricalFigures);

figuresRouter.get('/options', getFiguresOptions);

figuresRouter.get('/:id', getHistoricalFigure);

figuresRouter.post('/', authorize, isAdmin, upload.single("image"), addFigure);

figuresRouter.put('/:id', authorize, isAdmin, upload.single("image"), updateFigure);

figuresRouter.delete('/:id', authorize, isAdmin, upload.single("image"), deleteFigure);

export default figuresRouter;