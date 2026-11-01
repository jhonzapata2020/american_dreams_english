'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'pill';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'compact',
  showLabel = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer overflow-hidden transition-colors duration-300 ${
        variant === 'compact'
          ? 'w-8.5 h-8.5 rounded-full p-1.5'
          : 'px-3 py-1.5 rounded-full gap-2'
      } ${
        isDark
          ? 'bg-slate-800/90 text-amber-300 border border-slate-700 shadow-md shadow-slate-900/40 hover:bg-slate-750 hover:border-slate-600'
          : 'bg-slate-100/90 text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-200/80 hover:text-slate-900'
      } ${className}`}
    >
      {/* Halo de luz ambiental según el tema */}
      <div
        className={`absolute inset-0 rounded-full blur-xs transition-opacity duration-500 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-amber-300/20 opacity-100'
            : 'bg-gradient-to-tr from-amber-400/20 via-orange-300/15 to-transparent opacity-80'
        }`}
      />

      {/* Astro Central Animado (Sol / Luna) con Física Celestial */}
      <div className="relative z-10 w-4 h-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative flex items-center justify-center text-amber-300"
            >
              <Moon className="w-3.5 h-3.5 fill-amber-300/20 stroke-[2]" />
              <motion.span
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 text-[8px] text-blue-300 pointer-events-none"
              >
                ✦
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative flex items-center justify-center text-amber-500"
            >
              <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Texto descriptivo opcional para variantes de menú */}
      {showLabel && (
        <span className="relative z-10 text-[11px] font-bold tracking-tight">
          {isDark ? 'Oscuro' : 'Claro'}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
