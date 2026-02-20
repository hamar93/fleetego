import React, { useState } from 'react';
import './Settings.css';
import IntegrationsSettings from './IntegrationsSettings';
import SecuritySettings from './SecuritySettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('integrations');

    return (
        <div className="fade-in p-6">
            <div className="page-header mb-8">
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">Beállítások</h2>
                <p className="text-[var(--text-secondary)]">Rendszer, integrációk és profil beállítások</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 
                        ${activeTab === 'integrations'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    onClick={() => setActiveTab('integrations')}
                >
                    <i className="fas fa-plug mr-2"></i> Integrációk
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 
                        ${activeTab === 'security'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    onClick={() => setActiveTab('security')}
                >
                    <i className="fas fa-shield-alt mr-2"></i> Biztonság
                </button>
            </div>

            {/* Content */}
            <div className="settings-content">
                {activeTab === 'integrations' && <IntegrationsSettings />}
                {activeTab === 'security' && <SecuritySettings />}
            </div>
        </div>
    );
};

export default Settings;
