const { Op } = require("sequelize");
const { CategoryModel } = require("../models");

exports.addCategory = async (categoryData) => {
    return await CategoryModel.create(categoryData);
};

exports.getCategoryByName = async (categoryName) => {
    return await CategoryModel.findOne({ where: { categoryName } });
};

exports.getCategoryById = async (categoryId) => {
    return await CategoryModel.findByPk(categoryId);
};

exports.getAllCategories = async (queryOptions = {}) => {
    const { search, sort } = queryOptions;

    const whereClause = {};

    if (search && search.trim() !== "") {
        whereClause.categoryName = {
            [Op.like]: `%${search.trim()}%`,
        };
    }

    let orderClause = [["createdAt", "DESC"]];

    if (sort) {
        switch (sort.toLowerCase()) {
            case "name_asc":
                orderClause = [["categoryName", "ASC"]];
                break;
            case "name_desc":
                orderClause = [["categoryName", "DESC"]];
                break;
            case "latest":
                orderClause = [["createdAt", "DESC"]];
                break;
            case "oldest":
                orderClause = [["createdAt", "ASC"]];
                break;
            default:
                orderClause = [["createdAt", "DESC"]];
                break;
        }
    }

    return await CategoryModel.findAll({
        where: whereClause,
        order: orderClause,
    });
};

exports.updateCategory = async (categoryId, categoryData) => {
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
        return null;
    }
    await category.update(categoryData);
    return category;
};

exports.softdeleteCategory = async (categoryId) => {
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
        return null;
    }
    await category.update({
        status: category.status === "active" ? "inactive" : "active",
    });
    return category;
};

exports.deleteCategory = async (categoryId) => {
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
        return null;
    }
    await category.destroy();
    return category;
};
