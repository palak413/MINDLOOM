import React from 'react';

// Simple fallback icon component that doesn't use FontAwesome
export const Icon = ({ name, size = 'md', className = '', ...props }) => {
  // Simple text-based fallback icons
  const iconMap = {
    home: '🏠',
    journal: '📖',
    tasks: '✅',
    plant: '🌱',
    mood: '❤️',
    breathing: '💨',
    store: '🏪',
    badges: '🏆',
    chat: '💬',
    profile: '👤',
    settings: '⚙️',
    logout: '🚪',
    add: '+',
    check: '✓',
    delete: '✗',
    edit: '✏️',
    send: '📤',
    search: '🔍',
    calendar: '📅',
    clock: '🕐',
    trending: '📈',
    sparkles: '✨',
    brain: '🧠',
    leaf: '🍃',
    sun: '☀️',
    cloud: '☁️',
    rain: '🌧️',
    bolt: '⚡',
    star: '⭐',
    moon: '🌙',
    pen: '✏️',
    eye: '👁️',
    eyeSlash: '🙈',
    bars: '☰',
    times: '✕',
    bell: '🔔',
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '❌',
    loading: '⏳',
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    angry: '😠',
    mail: '📧',
    lock: '🔒',
    userPlus: '👥',
    download: '⬇️',
    upload: '⬆️',
    share: '📤',
    bookmark: '🔖',
    thumbsUp: '👍',
    thumbsDown: '👎',
    microphone: '🎤',
    play: '▶️'
  };

  const iconText = iconMap[name] || '?';
  
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  return (
    <span 
      className={`${sizeMap[size] || 'text-base'} ${className}`}
      {...props}
    >
      {iconText}
    </span>
  );
};

export default Icon;
