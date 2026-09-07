const categoryRepo = require("../repositories/categoryRepo");
const { uploadImage } = require("../utils/cloudnary");

exports.addCategory = async (categoryData, file) => {
    const { categoryName } = categoryData;
    const existingCategory = await categoryRepo.getCategoryByName(categoryName);

    if (existingCategory) {
        throw new Error("Category name already exists");
    }

    if (file) {
        const result = await uploadImage(
            file,
            "QuickCart/Categories"
        );

        categoryData.categoryImage = result.secure_url;
    }

    return await categoryRepo.addCategory(categoryData);
};

exports.getCategoryByName = async (categoryName) => {
    return await categoryRepo.getCategoryByName(categoryName);
};

exports.getAllCategories = async (queryOptions = {}) => {
    return await categoryRepo.getAllCategories(queryOptions);
};

exports.updateCategory = async (categoryId, categoryData, file) => {
    const { categoryName } = categoryData;

    if (categoryName) {
        const existingCategory = await categoryRepo.getCategoryByName(categoryName);
        if (existingCategory && existingCategory.categoryId != categoryId) {
            throw new Error('Category name already exists');
        }
    }

    if (file) {
        const result = await uploadImage(
            file,
            "QuickCart/Categories"
        );

        categoryData.categoryImage = result.secure_url;
    }

    return await categoryRepo.updateCategory(categoryId, categoryData);
};

exports.softdeleteCategory = async (categoryId) => {
    return await categoryRepo.softdeleteCategory(categoryId);
};

exports.deleteCategory = async (categoryId) => {
    return await categoryRepo.deleteCategory(categoryId);
};
