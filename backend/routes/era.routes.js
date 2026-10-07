import { Router } from "express";
import { getEra, getEras, getErasOptions } from "../controllers/era.controller.js";
import multer from "multer"
import { addEra, deleteEra, updateEra } from "../controllers/era.admin.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";
import authorize from "../middlewares/auth.middleware.js";



const eraRouter = new Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, AVIF, and WEBP are allowed."));
    }
  },
});

eraRouter.get('/', getEras);

eraRouter.get('/options', getErasOptions);

eraRouter.get('/:id', getEra);

eraRouter.post('/', authorize, isAdmin, upload.single("image"), addEra);

eraRouter.put('/:id', authorize, isAdmin, upload.single("image"), updateEra);

eraRouter.delete('/:id', authorize, isAdmin, upload.single("image"), deleteEra);

export default eraRouter;

