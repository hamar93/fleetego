import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // ID of user being processed
    const [message, setMessage] = useState(null);

    const fetchPendingUsers = async () => {
        try {
            const response = await api.get('/api/auth/admin/pending-users');
            setPendingUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch pending users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleAction = async (userId, action) => {
        setActionLoading(userId);
        setMessage(null);
        try {
            if (action === 'approve') {
                await api.post(`/api/auth/admin/approve-user/${userId}`);
                setMessage({ type: 'success', text: 'Felhasználó sikeresen jóváhagyva.' });
            } else {
                await api.post(`/api/auth/admin/reject-user/${userId}`);
                setMessage({ type: 'info', text: 'Felhasználó elutasítva.' });
            }
            // Refresh list
            fetchPendingUsers();
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
            setMessage({ type: 'error', text: 'Hiba történt a művelet során.' });
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Vezérlőpult</h1>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' :
                            message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'
                        }`}></i>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Függőben lévő Regisztrációk</h2>
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                        {pendingUsers.length} új
                    </span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Betöltés...</div>
                ) : pendingUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <i className="fas fa-check-circle text-4xl mb-3 text-green-500/50"></i>
                        <p>Nincs függőben lévő regisztráció.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase">
                                    <th className="p-4 font-semibold">Dátum</th>
                                    <th className="p-4 font-semibold">Cég</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Állapot</th>
                                    <th className="p-4 font-semibold text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {new Date(user.created_at).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(user.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                                            {user.company_name}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-xs font-medium">
                                                PENDING
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleAction(user.id, 'approve')}
                                                disabled={actionLoading === user.id}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === user.id ? '...' : 'Jóváhagyás'}
                                            </button>
                                            <button
                                                onClick={() => handleAction(user.id, 'reject')}
                                                disabled={actionLoading === user.id}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === user.id ? '...' : 'Elutasítás'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
