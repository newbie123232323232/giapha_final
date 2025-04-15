// Import models
const User = require('./user.model');
const { FamilyTree, FamilyMember } = require('./family-tree.model');
const Event = require('./event.model');
const ThanhVien = require('./thanhvien.model');
const GiaPha = require('./giapha.model');
const GroupChat = require('./groupchat.model');
const FamilyFund = require('./familyfund.model');
const FamilyImage = require('./familyimage.model');
const ChatMessage = require('./chatmessage.model');
const FundTransaction = require('./fundtransaction.model');
// const Product = require('./product.model')

module.exports = {
    User,
    FamilyTree,
    FamilyMember,
    Event,
    ThanhVien,
    GiaPha,
    GroupChat,
    FamilyFund,
    FamilyImage,
    ChatMessage,
    FundTransaction
    // Product
};