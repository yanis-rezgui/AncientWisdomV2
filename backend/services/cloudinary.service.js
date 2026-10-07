import { cloudinary } from "../config/env.js";


export const uploadImage = (file) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder: "Ancient-Wisdom"
            },

            (error, result) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });

            }

        );

        stream.end(file.buffer);

    });

};


export const deleteImage = async (publicId) => {

    return cloudinary.uploader.destroy(

        publicId,

        {
            resource_type: "image",
            type: "upload",
            invalidate: true
        }

    );

};