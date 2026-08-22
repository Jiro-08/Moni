import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('moni_theme') || 'dark';
  });

  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('moni_currency') || '₱';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('moni_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setCurrency = (symbol) => {
    setCurrencyState(symbol);
    localStorage.setItem('moni_currency', symbol);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currency, setCurrency }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
