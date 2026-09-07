const { Op } = require("sequelize");
const { ProductModel, CategoryModel } = require("../models/index");

exports.addProduct = async (productData) => {
    return await ProductModel.create(productData);
};

exports.getAllProducts = async (queryOptions = {}) => {
    const { search, sort, category, categoryId, status } = queryOptions;
    const targetCategory = category !== undefined && category !== null && category !== "" ? category : categoryId;

    const whereClause = {};

    if (search && search.trim() !== "") {
        whereClause.productName = {
            [Op.like]: `%${search.trim()}%`,
        };
    }

    if (status && status.trim() !== "") {
        whereClause.status = status.trim().toLowerCase();
    }

    const categoryWhere = {};
    if (
        targetCategory !== undefined &&
        targetCategory !== null &&
        targetCategory.toString().trim() !== "" &&
        targetCategory.toString().trim().toLowerCase() !== "all"
    ) {
        const categoryTerm = targetCategory.toString().trim();
        if (!isNaN(categoryTerm)) {
            whereClause.categoryId = Number(categoryTerm);
        } else {
            categoryWhere.categoryName = {
                [Op.like]: `%${categoryTerm}%`,
            };
        }
    }

    let orderClause = [["createdAt", "DESC"]];

    if (sort) {
        switch (sort.toLowerCase()) {
            case "price_asc":
                orderClause = [["price", "ASC"]];
                break;
            case "price_desc":
                orderClause = [["price", "DESC"]];
                break;
            case "name_asc":
                orderClause = [["productName", "ASC"]];
                break;
            case "name_desc":
                orderClause = [["productName", "DESC"]];
                break;
            case "latest":
            case "newest":
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

    return await ProductModel.findAll({
        where: whereClause,
        include: [
            {
                model: CategoryModel,
                attributes: ["categoryId", "categoryName"],
                where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
                required: Object.keys(categoryWhere).length > 0,
            },
        ],
        order: orderClause,
    });
};

exports.getProductById = async (productId) => {
    return await ProductModel.findByPk(productId, {
        include: [
            {
                model: CategoryModel,
                attributes: ["categoryId", "categoryName"],
            },
        ],
    });
};

exports.updateProduct = async (productId, productData) => {
    const product = await ProductModel.findByPk(productId);

    if (!product) {
        return null;
    }

    await product.update(productData);
    return product;
};

exports.softdeleteProduct = async (productId) => {
    const product = await ProductModel.findByPk(productId);

    if (!product) {
        return null;
    }

    await product.update({
        status: product.status === "active" ? "inactive" : "active",
    });

    return product;
};

exports.deleteProduct = async (productId) => {
    const product = await ProductModel.findByPk(productId);

    if (!product) {
        return null;
    }

    await product.destroy();
    return product;
};