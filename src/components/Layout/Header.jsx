import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header = ({ title = "Dashboard", onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'hu', label: 'HU', flag: '🇭🇺' },
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'de', label: 'DE', flag: '🇩🇪' },
        { code: 'cz', label: 'CZ', flag: '🇨🇿' },
        { code: 'sk', label: 'SK', flag: '🇸🇰' },
        { code: 'ro', label: 'RO', flag: '🇷🇴' },
        { code: 'pl', label: 'PL', flag: '🇵🇱' },
        { code: 'hr', label: 'HR', flag: '🇭🇷' },
        { code: 'ru', label: 'RU', flag: '🇷🇺' }
    ];

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={onToggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="user-info">
                {/* Language Selector */}
                <div className="language-selector" style={{ position: 'relative', marginRight: '8px' }}>
                    <select
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.6rem',
                            outline: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code} style={{ color: '#000' }}>
                                {lang.flag} {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn-secondary"
                    onClick={toggleTheme}
                    style={{
                        borderRadius: '30px',
                        padding: '0.5rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem'
                    }}
                >
                    {theme === 'dark' ?
                        <><i className="fas fa-sun" style={{ color: '#fbbf24' }}></i> {t('header.light_mode')}</> :
                        <><i className="fas fa-moon" style={{ color: '#a855f7' }}></i> {t('header.dark_mode')}</>
                    }
                </button>

                <button className="btn-secondary" style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    color: '#fbbf24'
                }}>
                    <i className="fas fa-bell"></i>
                </button>

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-details" style={{ marginRight: '8px' }}>
                        <div className="user-name">{t('header.admin_user')}</div>
                        {/* <div className="user-role">{t('header.super_admin')}</div> */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
