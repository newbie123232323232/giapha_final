const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const familyTreeRoutes = require('./family-tree.routes');
const eventRoutes = require('./event.routes');
// const productRoutes = require('./product.routes')

// Use routes
router.use('/auth', authRoutes);
router.use('/family-trees', familyTreeRoutes);
router.use('/events', eventRoutes);
// router.use('/products', productRoutes)

module.exports = router;