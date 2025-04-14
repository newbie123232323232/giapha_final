import React, { useState, useEffect } from 'react';
import { loadGroupChatMessages, saveGroupChatMessages } from '../utils/groupChatUtils'; // Import utils

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest' };

  // Kiểm tra nếu currentUser hợp lệ, nếu không gán lại 'Guest'
  if (!currentUser || !currentUser.name) {
    currentUser.name = 'Guest';
  }

  // Khi component mount, tải dữ liệu tin nhắn từ localStorage
  useEffect(() => {
    const savedMessages = loadGroupChatMessages(currentUser.name); // Gửi username vào để tải tin nhắn của người dùng
    setMessages(savedMessages);
  }, [currentUser.name]);

  // Hàm gửi tin nhắn
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: currentUser.name,
      content: input,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    try {
      setMessages(updatedMessages);
      saveGroupChatMessages(currentUser.name, updatedMessages); // Lưu tin nhắn mới vào localStorage theo người dùng
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setInput(''); // Reset input sau khi gửi
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Group Chat</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === currentUser.name ? 'right' : 'left',
              marginBottom: '10px',
              backgroundColor: msg.sender === currentUser.name ? '#d1e7dd' : '#f8d7da',
              padding: '8px',
              borderRadius: '8px',
              maxWidth: '70%',
              marginLeft: msg.sender === currentUser.name ? 'auto' : 0,
              marginRight: msg.sender === currentUser.name ? 0 : 'auto'
            }}
          >
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
        style={{ width: '80%', padding: '8px', marginRight: '8px' }}
      />
      <button onClick={handleSend}>Gửi</button>
    </div>
  );
};

export default GroupChat;
