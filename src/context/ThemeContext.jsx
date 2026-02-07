import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check localStorage or system preference, default to 'dark' for cyberpunk
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('fleetego-theme');
        if (savedTheme) {
            return savedTheme;
        }
        return 'dark';
    });

    useEffect(() => {
        // Apply theme to document element
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('fleetego-theme', theme);

        // Tailwind check: Add 'dark' class to html element
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
