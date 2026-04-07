import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const COLOR_SCHEMES = {
  PURPLE: 'purple',
  BLUE: 'blue',
  GREEN: 'green',
  PINK: 'pink',
  ORANGE: 'orange',
  TEAL: 'teal'
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [colorScheme, setColorScheme] = useState('purple');
  const [fontSize, setFontSize] = useState('normal');
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeenVisible, setLastSeenVisible] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') || 'light';
    const savedColorScheme = localStorage.getItem('colorScheme') || 'purple';
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    const savedSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const savedOnlineStatus = localStorage.getItem('onlineStatus') !== 'false';
    const savedReadReceipts = localStorage.getItem('readReceipts') !== 'false';
    const savedLastSeenVisible = localStorage.getItem('lastSeenVisible') !== 'false';

    setThemeMode(savedThemeMode);
    setColorScheme(savedColorScheme);
    setFontSize(savedFontSize);
    setNotifications(savedNotifications);
    setCompactMode(savedCompactMode);
    setSoundEnabled(savedSoundEnabled);
    setOnlineStatus(savedOnlineStatus);
    setReadReceipts(savedReadReceipts);
    setLastSeenVisible(savedLastSeenVisible);

    applyTheme(savedThemeMode, savedColorScheme, savedFontSize, savedCompactMode);
  }, []);

  const applyTheme = (mode, scheme, size, compact) => {
    document.documentElement.setAttribute('data-theme-mode', mode);
    document.documentElement.setAttribute('data-color-scheme', scheme);
    document.documentElement.setAttribute('data-font-size', size);
    document.documentElement.setAttribute('data-compact', compact);
  };

  // Update theme mode (light/dark)
  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    applyTheme(newMode, colorScheme, fontSize, compactMode);
  };

  // Change color scheme
  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    applyTheme(themeMode, scheme, fontSize, compactMode);
  };

  // Update font size
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    applyTheme(themeMode, colorScheme, size, compactMode);
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
    applyTheme(themeMode, colorScheme, fontSize, newCompactMode);
  };

  // Toggle sound
  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('soundEnabled', newSoundEnabled);
  };

  // Toggle online status
  const toggleOnlineStatus = () => {
    const newOnlineStatus = !onlineStatus;
    setOnlineStatus(newOnlineStatus);
    localStorage.setItem('onlineStatus', newOnlineStatus);
  };

  // Toggle read receipts
  const toggleReadReceipts = () => {
    const newReadReceipts = !readReceipts;
    setReadReceipts(newReadReceipts);
    localStorage.setItem('readReceipts', newReadReceipts);
  };

  // Toggle last seen visibility
  const toggleLastSeenVisible = () => {
    const newLastSeenVisible = !lastSeenVisible;
    setLastSeenVisible(newLastSeenVisible);
    localStorage.setItem('lastSeenVisible', newLastSeenVisible);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleThemeMode,
        colorScheme,
        changeColorScheme,
        fontSize,
        changeFontSize,
        notifications,
        toggleNotifications,
        compactMode,
        toggleCompactMode,
        soundEnabled,
        toggleSound,
        onlineStatus,
        toggleOnlineStatus,
        readReceipts,
        toggleReadReceipts,
        lastSeenVisible,
        toggleLastSeenVisible
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
