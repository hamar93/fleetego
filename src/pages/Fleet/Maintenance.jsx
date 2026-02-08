import React, { useState } from 'react';
import IssueList from './Components/IssueList';
import IssueForm from './Components/IssueForm';

const Maintenance = () => {
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleIssueCreated = () => {
        setShowForm(false);
        setRefreshTrigger(prev => prev + 1); // Trigger list reload
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Karbantartás & Hibák</h1>
                    <p className="text-gray-500 dark:text-gray-400">Járműflotta műszaki állapotának követése</p>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-transform active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-plus-circle"></i>
                        Új hiba bejelentése
                    </button>
                )}
            </div>

            {showForm && (
                <div className="animate-fade-in-down">
                    <IssueForm
                        onIssueCreated={handleIssueCreated}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <IssueList key={refreshTrigger} />
        </div>
    );
};

export default Maintenance;
