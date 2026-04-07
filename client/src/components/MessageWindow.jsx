import React, { useState, useRef, useEffect } from 'react';
import '../styles/MessageWindow.css';

const MessageWindow = ({ messages, currentUser, onSendMessage, onTyping, isTyping, onMarkRead }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark received messages as read when they're visible
    messages.forEach((msg) => {
      if (msg.sender !== currentUser.id && msg.status !== 'read' && onMarkRead) {
        onMarkRead(msg.id);
      }
    });
  }, [messages, currentUser.id, onMarkRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    if (status === 'read') return 'read';
    if (status === 'delivered') return 'delivered';
    return 'sent';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    onTyping();
  };

  return (
    <div className="message-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === currentUser.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <div className="message-footer">
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  {msg.sender === currentUser.id && (
                    <span className={`status-icon ${getStatusClass(msg.status)}`}>
                      {getStatusIcon(msg.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && <p className="typing">User is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default MessageWindow;
