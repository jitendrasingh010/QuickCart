const cloudinary = require("../config/cloudnaryconfig");
const streamifier = require("streamifier");

const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "image",
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);

            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);

    });
};

module.exports = {
    uploadImage,
};
