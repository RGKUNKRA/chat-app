import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Settings.css';

const Settings = ({ onClose }) => {
  const { theme, toggleTheme, fontSize, changeFontSize, notifications, toggleNotifications, compactMode, toggleCompactMode } = useTheme();
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
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            ⚙️ Other
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>

              <div className="setting-item">
                <div className="setting-label">
                  <label>Theme</label>
                  <span className="current-value">{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
                </div>
                <button
                  className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={toggleTheme}
                >
                  <span className="toggle-slider"></span>
                </button>
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
            </div>
          )}

          {activeTab === 'other' && (
            <div className="settings-section">
              <h3>Other Settings</h3>

              <div className="setting-item">
                <label>About</label>
                <p className="setting-description">
                  RG Chat v1.0.0<br />
                  Real-time chat application built with React, Node.js, and Socket.io
                </p>
              </div>

              <div className="setting-item">
                <label>Application Info</label>
                <div className="info-list">
                  <p><strong>Version:</strong> 1.0.0</p>
                  <p><strong>Database:</strong> MongoDB</p>
                  <p><strong>Real-time:</strong> Socket.io</p>
                </div>
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
