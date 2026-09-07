const QRCode = require("qrcode");

const generateQRCode = async (productId) => {
    try {

        const qrBuffer = await QRCode.toBuffer(productId.toString(), {
            type: "png",
            width: 300,
            margin: 2,
        });

        return qrBuffer;

    } catch (error) {
        throw error;
    }
};

module.exports = {
    generateQRCode,
};