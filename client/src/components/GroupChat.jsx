import React, { useEffect, useState, useCallback } from 'react';
import '../styles/GroupChat.css';

const GroupChat = ({ group, currentUser, socket, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchGroupMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${group._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  }, [group._id, token]);

  const handleReceiveMessage = useCallback((message) => {
    if (message.group === group._id) {
      setMessages(prev => [...prev, message]);
    }
  }, [group._id]);

  useEffect(() => {
    if (!group._id) return;
    
    fetchGroupMessages();
    
    if (socket) {
      socket.emit('join_group', group._id);
      socket.on('receive_group_message', handleReceiveMessage);
    }

    return () => {
      if (socket) {
        socket.emit('leave_group', group._id);
        socket.off('receive_group_message', handleReceiveMessage);
      }
    };
  }, [group._id, socket, fetchGroupMessages, handleReceiveMessage]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageText.trim() && socket) {
      socket.emit('send_group_message', {
        senderId: currentUser.id,
        groupId: group._id,
        text: messageText
      });

      setMessageText('');
    }
  };

  return (
    <div className="group-chat">
      <div className="group-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="group-info">
          <h2>{group.name}</h2>
          <p className="member-count">{group.members?.length || 0} members</p>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <p className="loading">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id}
              className={`message ${msg.sender._id === currentUser.id ? 'sent' : 'received'}`}
            >
              <div className="message-sender">{msg.sender.username}</div>
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default GroupChat;
