const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const upload = require('../middelware/upload.js');
const auth = require('../middelware/auth.js');

router.post('/add', upload.single('categoryImage'), auth, categoryController.addCategory);
router.get('/categories', auth, categoryController.getAllCategories);
router.get('/get/:categoryName', auth, categoryController.getCategoryByName);
router.put('/update/:categoryId', upload.single('categoryImage'), auth, categoryController.updateCategory);
router.put('/softdelete/:categoryId', auth, categoryController.softdeleteCategory);
router.delete('/delete/:categoryId', auth, categoryController.deleteCategory);

module.exports = router;
