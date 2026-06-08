const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { requireAuth } = require('../middlewares/auth');

//importControllers
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

// dectect Error from Multer
const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) return res.status(400).json({ error: 'อัปโหลดไฟล์ล้มเหลว: ' + err.message });
    next();
  });
};

// --- Auth ---
router.post('/login', authController.login);

// --- Customer API ---
router.get('/products', orderController.getProducts);
router.post('/orders', handleUpload('slipImage'), orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/slip', handleUpload('slipImage'), orderController.updateSlip);

// --- Admin API (Requires Auth) ---
router.get('/admin/orders', requireAuth, orderController.getAdminOrders);
router.put('/orders/:id/status', requireAuth, orderController.updateOrderStatus);
router.delete('/orders/:id', requireAuth, orderController.deleteOrder);

module.exports = router;