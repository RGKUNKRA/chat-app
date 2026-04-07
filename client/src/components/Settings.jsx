import React, { useState } from 'react';
import { useTheme, COLOR_SCHEMES } from '../context/ThemeContext';
import '../styles/Settings.css';

const SCHEME_COLORS = {
  [COLOR_SCHEMES.PURPLE]: { label: '🟣 Purple', icon: '🎨' },
  [COLOR_SCHEMES.BLUE]: { label: '🔵 Blue', icon: '🎨' },
  [COLOR_SCHEMES.GREEN]: { label: '🟢 Green', icon: '🎨' },
  [COLOR_SCHEMES.PINK]: { label: '🩷 Pink', icon: '🎨' },
  [COLOR_SCHEMES.ORANGE]: { label: '🟠 Orange', icon: '🎨' },
  [COLOR_SCHEMES.TEAL]: { label: '🔷 Teal', icon: '🎨' }
};

const Settings = ({ onClose }) => {
  const { 
    themeMode, toggleThemeMode, 
    colorScheme, changeColorScheme,
    fontSize, changeFontSize, 
    notifications, toggleNotifications, 
    compactMode, toggleCompactMode,
    soundEnabled, toggleSound,
    onlineStatus, toggleOnlineStatus,
    readReceipts, toggleReadReceipts,
    lastSeenVisible, toggleLastSeenVisible
  } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            🎨 Appearance
          </button>
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            🔐 Privacy
          </button>
          <button
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Theme Mode</label>
                  <span className="current-value">{themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
                </div>
                <button
                  className={`toggle-btn ${themeMode === 'dark' ? 'active' : ''}`}
                  onClick={toggleThemeMode}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="setting-item">
                <label>Color Scheme</label>
                <div className="color-scheme-grid">
                  {Object.entries(COLOR_SCHEMES).map(([key, value]) => (
                    <button
                      key={key}
                      className={`scheme-btn ${colorScheme === value ? 'active' : ''}`}
                      onClick={() => changeColorScheme(value)}
                      title={SCHEME_COLORS[value].label}
                      data-scheme={value}
                    >
                      {SCHEME_COLORS[value].label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-item">
                <label>Font Size</label>
                <div className="font-size-options">
                  <button
                    className={`size-btn ${fontSize === 'small' ? 'active' : ''}`}
                    onClick={() => changeFontSize('small')}
                    style={{ fontSize: '12px' }}
                  >
                    Small
                  </button>
                  <button
                    className={`size-btn ${fontSize === 'normal' ? 'active' : ''}`}
                    onClick={() => changeFontSize('normal')}
                    style={{ fontSize: '14px' }}
                  >
                    Normal
                  </button>
                  <button
                    className={`size-btn ${fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => changeFontSize('large')}
                    style={{ fontSize: '16px' }}
                  >
                    Large
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Compact Mode</label>
                  <span className="current-value">{compactMode ? 'On' : 'Off'}</span>
                </div>
                <button
                  className={`toggle-btn ${compactMode ? 'active' : ''}`}
                  onClick={toggleCompactMode}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy & Status</h3>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Show Online Status</label>
                  <span className="current-value">{onlineStatus ? 'Visible' : 'Hidden'}</span>
                </div>
                <button
                  className={`toggle-btn ${onlineStatus ? 'active' : ''}`}
                  onClick={toggleOnlineStatus}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <p className="setting-description">
                When enabled, your contacts can see when you're online or offline.
              </p>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Read Receipts</label>
                  <span className="current-value">{readReceipts ? 'On' : 'Off'}</span>
                </div>
                <button
                  className={`toggle-btn ${readReceipts ? 'active' : ''}`}
                  onClick={toggleReadReceipts}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <p className="setting-description">
                When enabled, senders can see when you've read their messages.
              </p>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Show Last Seen</label>
                  <span className="current-value">{lastSeenVisible ? 'Visible' : 'Hidden'}</span>
                </div>
                <button
                  className={`toggle-btn ${lastSeenVisible ? 'active' : ''}`}
                  onClick={toggleLastSeenVisible}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <p className="setting-description">
                When enabled, your contacts can see when you were last active.
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Enable Notifications</label>
                  <span className="current-value">{notifications ? 'On' : 'Off'}</span>
                </div>
                <button
                  className={`toggle-btn ${notifications ? 'active' : ''}`}
                  onClick={toggleNotifications}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <p className="setting-description">
                When enabled, you'll receive notifications for new messages. Desktop notifications require your browser permission.
              </p>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Sound Notifications</label>
                  <span className="current-value">{soundEnabled ? 'On' : 'Off'}</span>
                </div>
                <button
                  className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                  onClick={toggleSound}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <p className="setting-description">
                Play a sound when you receive a new message.
              </p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="settings-section">
              <h3>About RG Chat</h3>

              <div className="setting-item">
                <label>Application Info</label>
                <div className="info-list">
                  <p><strong>Application:</strong> RG Chat v1.0.0</p>
                  <p><strong>Backend:</strong> Node.js + Express</p>
                  <p><strong>Frontend:</strong> React 18.2.0</p>
                  <p><strong>Database:</strong> MongoDB</p>
                  <p><strong>Real-time:</strong> Socket.io v4.6.1</p>
                </div>
              </div>

              <div className="setting-item">
                <label>Features</label>
                <div className="features-list">
                  <p>✅ 1-on-1 Real-time Messaging</p>
                  <p>✅ Group Chat</p>
                  <p>✅ User Search</p>
                  <p>✅ Message Status & Read Receipts</p>
                  <p>✅ Last Seen Timestamps</p>
                  <p>✅ Multiple Themes & Customization</p>
                </div>
              </div>

              <div className="setting-item">
                <label>Built with ❤️</label>
                <p className="setting-description">
                  RG Chat is a modern chat application focusing on real-time communication, privacy, and user experience.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
