const productService = require('../services/productServices.js');

exports.addProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body, req.file);
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.softdeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.softdeleteProduct(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product soft deleted successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error soft deleting product', error: error.message || error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search, sort, category, categoryId, status } = req.query;
    const targetCategory = category || categoryId;
    const products = await productService.getAllProducts({ search, sort, category: targetCategory, status });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message || error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message || error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.updateProduct(productId, req.body, req.file);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.deleteProduct(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message || error });
  }
};
