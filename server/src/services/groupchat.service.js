const { GroupChat, ChatMessage, ThanhVien } = require('../models');

class GroupChatService {
    async createGroup(data) {
        return await GroupChat.create(data);
    }

    async getGroups() {
        return await GroupChat.findAll({
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }]
        });
    }

    async getGroupById(id) {
        return await GroupChat.findByPk(id, {
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }]
        });
    }

    async updateGroup(id, data) {
        const group = await GroupChat.findByPk(id);
        if (!group) throw new Error('Group not found');
        return await group.update(data);
    }

    async deleteGroup(id) {
        const group = await GroupChat.findByPk(id);
        if (!group) throw new Error('Group not found');
        return await group.destroy();
    }

    async sendMessage(data) {
        return await ChatMessage.create(data);
    }

    async getMessages(groupId) {
        return await ChatMessage.findAll({
            where: { ID_NhomChat: groupId },
            include: [{
                model: ThanhVien,
                attributes: ['Ten']
            }],
            order: [['NgayGui', 'ASC']]
        });
    }
}

module.exports = new GroupChatService(); 