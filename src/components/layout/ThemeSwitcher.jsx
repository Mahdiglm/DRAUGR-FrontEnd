import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const themes = [
    { id: 'draugr', name: 'دراگور', icon: '🩸', label: 'خون آشام باستانی' },
    { id: 'vampire', name: 'خون آشام', icon: '🧛', label: 'سبک گوتیک' },
    { id: 'witch', name: 'جادوگر', icon: '🧙‍♀️', label: 'جادوی تاریک' },
    { id: 'werewolf', name: 'گرگینه', icon: '🐺', label: 'نیروی وحشی' }
  ];
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleThemeChange = (themeId) => {
    onThemeChange(themeId);
    setIsOpen(false);
  };
  
  // Get current theme info
  const currentThemeInfo = themes.find(theme => theme.id === currentTheme) || themes[0];
  
  return (
    <div className="fixed bottom-10 left-10 z-40">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`flex items-center space-x-2 p-3 rounded-full shadow-${currentTheme} 
                    bg-gradient-to-r ${getThemeGradient(currentTheme)} 
                    text-${getThemeText(currentTheme)} text-shadow-${currentTheme}`}
      >
        <span className="text-lg ml-2">{currentThemeInfo.icon}</span>
        <span className="font-medium hidden sm:inline">{currentThemeInfo.name}</span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-0 rounded-lg p-2 bg-charcoal backdrop-blur-md border border-gray-800 min-w-max"
          >
            <div className="p-2 gap-2 grid">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.05, backgroundColor: getThemeHoverColor(theme.id) }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`flex items-center rounded-md py-2 px-3 text-sm transition-all
                            ${currentTheme === theme.id 
                              ? `bg-gradient-to-r ${getThemeGradient(theme.id)} text-${getThemeText(theme.id)}`
                              : 'text-gray-300 hover:text-white'}`}
                >
                  <span className="text-xl ml-2">{theme.icon}</span>
                  <div className="flex flex-col items-start">
                    <span>{theme.name}</span>
                    <span className="text-xs opacity-70">{theme.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper functions for dynamic styling
const getThemeGradient = (theme) => {
  switch(theme) {
    case 'vampire': return 'from-vampire-dark to-vampire-primary';
    case 'witch': return 'from-witch-dark to-witch-primary';
    case 'werewolf': return 'from-werewolf-dark to-werewolf-primary';
    default: return 'from-draugr-900 to-draugr-700'; // draugr theme
  }
};

const getThemeText = (theme) => {
  switch(theme) {
    case 'vampire': return 'vampire-light';
    case 'witch': return 'witch-light';
    case 'werewolf': return 'werewolf-light';
    default: return 'white'; // draugr theme
  }
};

const getThemeHoverColor = (theme) => {
  switch(theme) {
    case 'vampire': return 'rgba(74, 0, 0, 0.5)';
    case 'witch': return 'rgba(59, 45, 64, 0.5)';
    case 'werewolf': return 'rgba(94, 79, 43, 0.5)';
    default: return 'rgba(102, 0, 0, 0.5)'; // draugr theme
  }
};

export default ThemeSwitcher; 