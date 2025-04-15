const { FamilyFund, FundTransaction, ThanhVien } = require('../models');

class FamilyFundService {
    async createFund(data) {
        return await FamilyFund.create({
            ...data,
            SoTienHienTai: 0
        });
    }

    async getFunds() {
        return await FamilyFund.findAll({
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }]
        });
    }

    async getFundById(id) {
        return await FamilyFund.findByPk(id, {
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }]
        });
    }

    async updateFund(id, data) {
        const fund = await FamilyFund.findByPk(id);
        if (!fund) throw new Error('Fund not found');
        return await fund.update(data);
    }

    async deleteFund(id) {
        const fund = await FamilyFund.findByPk(id);
        if (!fund) throw new Error('Fund not found');
        return await fund.destroy();
    }

    async addTransaction(data) {
        const { SoTien, LoaiGiaoDich, ID_Quy, ID_ThanhVien, MoTa } = data;
        
        // Create transaction
        const transaction = await FundTransaction.create({
            SoTien,
            LoaiGiaoDich,
            ID_Quy,
            ID_ThanhVien,
            MoTa
        });

        // Update fund balance
        const fund = await FamilyFund.findByPk(ID_Quy);
        if (LoaiGiaoDich === 'deposit') {
            fund.SoTienHienTai += SoTien;
        } else {
            fund.SoTienHienTai -= SoTien;
        }
        await fund.save();

        return transaction;
    }

    async getTransactions(fundId) {
        return await FundTransaction.findAll({
            where: { ID_Quy: fundId },
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }],
            order: [['NgayGiaoDich', 'DESC']]
        });
    }
}

module.exports = new FamilyFundService(); 