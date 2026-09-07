const cloudinary = require("../config/cloudnaryconfig");
const streamifier = require("streamifier");

const uploadQRCode = (qrBuffer, folder) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(qrBuffer).pipe(stream);

    });
};

module.exports = {
    uploadQRCode,
};