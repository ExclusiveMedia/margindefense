/**
 * Theme Toggle Component
 * Animated switch between light and dark modes
 */

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div 
        className="theme-toggle__slider"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="theme-toggle__icon" />
        ) : (
          <Sun className="theme-toggle__icon" />
        )}
      </motion.div>
    </button>
  );
}

// Compact version for tight spaces
export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-[hsl(var(--md-bg-hover))]"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-[hsl(var(--md-text-secondary))]" />
        ) : (
          <Sun className="w-5 h-5 text-[hsl(var(--md-alert))]" />
        )}
      </motion.div>
    </button>
  );
}

export default ThemeToggle;
