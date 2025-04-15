// Import controllers
const authController = require('./auth.controller')
const familyTreeController = require('./family-tree.controller')
const eventController = require('./event.controller')
const groupChatController = require('./groupchat.controller')
const familyFundController = require('./familyfund.controller')
const { familyImageController, upload } = require('./familyimage.controller')
// const userController = require('./user.controller')
// const productController = require('./product.controller')

module.exports = {
         authController,
         familyTreeController,
         eventController,
         groupChatController,
         familyFundController,
         familyImageController,
         upload
    // userController
    // productController
}