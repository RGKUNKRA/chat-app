import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('normal');
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setNotifications(savedNotifications);
    setCompactMode(savedCompactMode);

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-compact', savedCompactMode);
  }, []);

  // Update theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Update font size
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications);
  };

  // Toggle compact mode
  const toggleCompactMode = () => {
    const newCompactMode = !compactMode;
    setCompactMode(newCompactMode);
    localStorage.setItem('compactMode', newCompactMode);
    document.documentElement.setAttribute('data-compact', newCompactMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        fontSize,
        changeFontSize,
        notifications,
        toggleNotifications,
        compactMode,
        toggleCompactMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
