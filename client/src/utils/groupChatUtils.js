// Lấy tin nhắn từ localStorage theo tên người dùng
export const loadGroupChatMessages = (username) => {
    const savedMessages = localStorage.getItem(`groupMessages_${username}`);
    
    // Nếu không có tin nhắn, trả về mảng rỗng
    if (!savedMessages) return [];
  
    try {
      // Kiểm tra và phân tích JSON hợp lệ
      return JSON.parse(savedMessages);
    } catch (error) {
      console.error("Error parsing messages from localStorage:", error);
      return [];  // Trả về mảng rỗng khi có lỗi phân tích JSON
    }
};
  
// Lưu tin nhắn vào localStorage theo tên người dùng
export const saveGroupChatMessages = (username, messages) => {
    try {
      localStorage.setItem(`groupMessages_${username}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
};
