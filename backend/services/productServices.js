const productRepo = require("../repositories/productsRepo");
const categoryRepo = require("../repositories/categoryRepo");
const { uploadImage } = require("../utils/cloudnary");
const { generateQRCode } = require("../utils/genetateqrCode");
const { uploadQRCode } = require("../utils/uploadQRCode");

exports.addProduct = async (productData, file) => {
    const category = await categoryRepo.getCategoryById(productData.categoryId);

    if (!category) {
        throw new Error("Category not found");
    }

    if (file) {
        const result = await uploadImage(file, "QuickCart/Products");
        productData.productImage = result.secure_url;
    }

    const createdProduct = await productRepo.addProduct(productData);
    const qrBuffer = await generateQRCode(createdProduct.productId);
    const qrUploadResult = await uploadQRCode(qrBuffer, "QuickCart/QR-Codes");

    return await productRepo.updateProduct(createdProduct.productId, {
        qrCode: qrUploadResult.secure_url,
    });
};

exports.getAllProducts = async (queryOptions = {}) => {
    return await productRepo.getAllProducts(queryOptions);
};

exports.getProductById = async (productId) => {
    return await productRepo.getProductById(productId);
};

exports.updateProduct = async (productId, productData, file) => {
    if (file) {
        const result = await uploadImage(file, "QuickCart/Products");
        productData.productImage = result.secure_url;
    }

    return await productRepo.updateProduct(productId, productData);
};

exports.deleteProduct = async (productId) => {
    return await productRepo.deleteProduct(productId);
};

exports.softdeleteProduct = async (productId) => {
    return await productRepo.softdeleteProduct(productId);
};
