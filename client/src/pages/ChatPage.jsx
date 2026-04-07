import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { chatService, groupService } from '../services/api';
import MessageWindow from '../components/MessageWindow';
import UserSearch from '../components/UserSearch';
import CreateGroup from '../components/CreateGroup';
import GroupChat from '../components/GroupChat';
import Settings from '../components/Settings';
import '../styles/Chat.css';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    setCurrentUser(user);

    const socketUrl = process.env.REACT_APP_SOCKET_URL || (
      process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:5000'
    );
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('user_join', user.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
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

    newSocket.on('message_read', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId ? { ...msg, status: 'read' } : msg
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await chatService.getUsers(token);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [token]);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await groupService.getMyGroups(token);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === 'groups') {
      fetchGroups();
    }
  }, [activeTab, fetchGroups]);

  const handleSelectUser = async (selectedUser) => {
    setSelectedGroup(null);
    setSelectedUser(selectedUser);
    setTyping(false);

    try {
      const response = await chatService.getMessages(selectedUser._id, token);
      setMessages(response.data);
      
      // Mark all messages from this user as read
      await chatService.markMessagesAsRead(selectedUser._id, token);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedUser(null);
    setSelectedGroup(group);
    setMessages([]);
  };

  const handleGroupCreated = (newGroup) => {
    setGroups([newGroup, ...groups]);
    setShowCreateGroup(false);
    handleSelectGroup(newGroup);
  };

  const handleMarkRead = (messageId) => {
    if (socket) {
      socket.emit('mark_message_read', {
        messageId,
        senderId: selectedUser?.id || selectedGroup?.creator
      });
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'offline';
    
    const now = new Date();
    const time = new Date(lastSeen);
    const diff = Math.floor((now - time) / 1000); // seconds
    
    if (diff < 60) return 'Active now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    
    return time.toLocaleDateString();
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
          <h2>RG Chat</h2>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
          </div>
        </div>
        <p className="user-info">{currentUser?.username}</p>

        {activeTab === 'users' && <UserSearch onSelectUser={handleSelectUser} />}

        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Chats
          </button>
          <button
            className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
          {activeTab === 'groups' && (
            <button
              className="create-group-btn"
              onClick={() => setShowCreateGroup(true)}
              title="Create new group"
            >
              +
            </button>
          )}
        </div>

        <div className="users">
          {activeTab === 'users'
            ? users.map(u => (
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
              ))
            : groups.map(g => (
                <div
                  key={g._id}
                  className={`user-item ${selectedGroup?._id === g._id ? 'active' : ''}`}
                  onClick={() => handleSelectGroup(g)}
                >
                  <div className="user-avatar">{g.name[0].toUpperCase()}</div>
                  <div className="user-info-text">
                    <p className="user-name">{g.name}</p>
                    <p className="group-members">{g.members?.length || 0} members</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedGroup ? (
          <GroupChat
            group={selectedGroup}
            currentUser={currentUser}
            socket={socket}
            onBack={() => setSelectedGroup(null)}
          />
        ) : selectedUser ? (
          <>
            <div className="chat-header">
              <h2>{selectedUser.username}</h2>
              <div className="user-status-info">
                <span className={`status ${selectedUser.status}`}>{selectedUser.status}</span>
                {selectedUser.status === 'offline' && (
                  <p className="last-seen">{formatLastSeen(selectedUser.lastSeen)}</p>
                )}
              </div>
            </div>
            <MessageWindow
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              isTyping={typing}
              onMarkRead={handleMarkRead}
            />
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a user or group to start chatting</p>
          </div>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroup
          onGroupCreated={handleGroupCreated}
          onCancel={() => setShowCreateGroup(false)}
        />
      )}

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default ChatPage;
