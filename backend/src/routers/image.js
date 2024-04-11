import express from 'express'; 
import { CloudinaryStorage } from "multer-storage-cloudinary"; 

import multer from "multer";
import cloudinary from '../config/cloudinary';
import { deleteImage, updateImage, uploadImage } from '../controllers/uploadImage';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "WE17309",
        format: "png",

    }
});
const upload = multer({ storage: storage })
const router = express.Router();

router.post("/images/upload", upload.array("images", 10), uploadImage)
router.delete("/images/:publicId", deleteImage)

router.put("/images/:publicId", upload.array("images", 10), updateImage);


export default router