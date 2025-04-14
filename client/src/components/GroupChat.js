import React, { useState, useEffect } from 'react';
import { loadGroupChatMessages, saveGroupChatMessages } from '../utils/groupChatUtils'; // Import utils
import './GroupChat.css';

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

  // Hàm format thời gian
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="group-chat-container">
      <div className="chat-header">
        <h2 className="mb-0">Group Chat</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === currentUser.name ? 'sent' : 'received'}`}
          >
            <div className="message-sender">{msg.sender}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">{formatTime(msg.timestamp)}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
