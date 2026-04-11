import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { chatService } from '../services/api';
import MessageWindow from '../components/MessageWindow';
import Settings from '../components/Settings';
import { useTheme } from '../context/ThemeContext';
import '../styles/Chat.css';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = useCallback(async () => {
    try {
      const response = await chatService.getUsers(token);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    setCurrentUser(user);

    // Connect to socket with proper URL handling
    const getSocketUrl = () => {
      if (process.env.REACT_APP_SOCKET_URL) {
        return process.env.REACT_APP_SOCKET_URL;
      }
      
      // In production, use relative path (same host as frontend)
      if (process.env.NODE_ENV === 'production') {
        return window.location.origin;
      }
      
      // In development, use localhost
      return 'http://localhost:5000';
    };

    const socketUrl = getSocketUrl();
    console.log('Connecting to socket:', socketUrl);
    
    const newSocket = io(socketUrl, {
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('user_join', user.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('receive_message', (message) => {
      if (selectedUser && message.sender === selectedUser.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('user_typing', (data) => {
      if (selectedUser && data.userId === selectedUser.id) {
        setTyping(true);
      }
    });

    newSocket.on('user_stopped_typing', (data) => {
      if (selectedUser && data.userId === selectedUser.id) {
        setTyping(false);
      }
    });

    fetchUsers();

    return () => {
      newSocket.disconnect();
    };
  }, [token, user, navigate, fetchUsers, selectedUser]);

  const handleSelectUser = async (selectedUserArg) => {
    setSelectedUser(selectedUserArg);
    setTyping(false);

    try {
      const response = await chatService.getMessages(selectedUserArg._id, token);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (text) => {
    if (socket && selectedUser) {
      socket.emit('send_message', {
        senderId: currentUser.id,
        receiverId: selectedUser._id,
        text
      });

      setMessages(prev => [...prev, {
        sender: currentUser.id,
        receiver: selectedUser._id,
        text,
        timestamp: new Date()
      }]);

      socket.emit('stop_typing', {
        senderId: currentUser.id,
        receiverId: selectedUser._id
      });
    }
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        senderId: currentUser.id,
        receiverId: selectedUser._id
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="users-list">
        <div className="users-header">
          <div className="header-top">
            <h2>Chats</h2>
            <div className="header-actions">
              <button
                className="icon-btn theme-toggle"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                className="icon-btn settings-btn"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
          <p className="user-info">{currentUser?.username}</p>
        </div>

        <div className="users">
          {users.map(u => (
            <div
              key={u._id}
              className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
              onClick={() => handleSelectUser(u)}
            >
              <div className="user-avatar">{u.username[0].toUpperCase()}</div>
              <div className="user-info-text">
                <p className="user-name">{u.username}</p>
                <p className={`user-status ${u.status}`}>{u.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h2>{selectedUser.username}</h2>
              <span className={`status ${selectedUser.status}`}>
                {selectedUser.status}
              </span>
            </div>
            <MessageWindow
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              isTyping={typing}
            />
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Chat;
