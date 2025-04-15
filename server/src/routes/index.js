const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const familyTreeRoutes = require('./family-tree.routes');
const eventRoutes = require('./event.routes');
const groupChatRoutes = require('./groupchat.routes');
const familyFundRoutes = require('./familyfund.routes');
const familyImageRoutes = require('./familyimage.routes');
// const productRoutes = require('./product.routes')

// Use routes
router.use('/auth', authRoutes);
router.use('/family-tree', familyTreeRoutes);
router.use('/events', eventRoutes);
router.use('/group-chat', groupChatRoutes);
router.use('/family-funds', familyFundRoutes);
router.use('/family-images', familyImageRoutes);
// router.use('/products', productRoutes)

module.exports = router;