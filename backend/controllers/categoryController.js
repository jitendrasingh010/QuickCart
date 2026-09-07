const categoryService = require("../services/categoryServices");

exports.addCategory = async (req, res) => {
  try {
    const category = await categoryService.addCategory(req.body, req.file);
    console.log(">>>>>>>>",req.body)
    res.status(201).json({ message: "Category added successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const { search, sort } = req.query;
    const categories = await categoryService.getAllCategories({ search, sort });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

exports.getCategoryByName = async (req, res) => {
  try {
    const category = await categoryService.getCategoryByName(req.params.categoryName);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.categoryId,
      req.body,
      req.file
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.softdeleteCategory = async (req, res) => {
  try {
    const category = await categoryService.softdeleteCategory(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category status updated", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
