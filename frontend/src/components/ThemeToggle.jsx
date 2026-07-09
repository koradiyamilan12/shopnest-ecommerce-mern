import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiSliders } from 'react-icons/fi';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync with system settings if system is chosen
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="navbar-icon-btn"
      title={`Current Theme: ${theme.toUpperCase()}. Click to change.`}
      aria-label="Toggle theme"
    >
      {theme === 'light' && <FiSun size={18} />}
      {theme === 'dark' && <FiMoon size={18} />}
      {theme === 'system' && <FiSliders size={18} />}
    </button>
  );
};

export default ThemeToggle;
