import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'office' });
    const [inviteLink, setInviteLink] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/auth/company/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/company/invite', inviteData);
            setInviteLink(res.data.link);
        } catch (error) {
            alert(error.response?.data?.detail || 'Hiba a meghíváskor');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) return;
        try {
            await api.delete(`/api/auth/company/users/${userId}`);
            fetchUsers();
        } catch (error) {
            alert('Hiba a törléskor');
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link másolva!');
    };

    const getRoleBadge = (role) => {
        const roles = {
            'admin': 'bg-red-100 text-red-800',
            'user': 'bg-blue-100 text-blue-800', // Owner usually
            'office': 'bg-green-100 text-green-800',
            'driver': 'bg-yellow-100 text-yellow-800',
            'subcontractor': 'bg-purple-100 text-purple-800'
        };
        const labels = {
            'admin': 'Admin',
            'user': 'Tulajdonos',
            'office': 'Irodista',
            'driver': 'Sofőr',
            'subcontractor': 'Alvállalkozó'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${roles[role] || 'bg-gray-100 text-gray-800'}`}>
                {labels[role] || role}
            </span>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Felhasználók Kezelése</h1>
                <button
                    onClick={() => { setIsInviteModalOpen(true); setInviteLink(null); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + Új Felhasználó Meghívása
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Betöltés...</div>
            ) : (
                <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Szerepkör</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Művelet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.email}</td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.status}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Meghívó Küldése</h2>

                        {!inviteLink ? (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email cím</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={inviteData.email}
                                        onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                        placeholder="kollega@ceg.hu"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Szerepkör</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                        {[
                                            { id: 'office', label: 'Irodista', icon: 'fa-laptop', desc: 'Teljes hozzáférés a fuvarokhoz' },
                                            { id: 'driver', label: 'Sofőr', icon: 'fa-truck', desc: 'Csak a saját fuvarok és chat' },
                                            { id: 'subcontractor', label: 'Alvállalkozó', icon: 'fa-handshake', desc: 'Csak Chat funkció' }
                                        ].map(role => (
                                            <div
                                                key={role.id}
                                                onClick={() => setInviteData({ ...inviteData, role: role.id })}
                                                className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${inviteData.role === role.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                            >
                                                <i className={`fas ${role.icon} text-2xl mb-2 ${inviteData.role === role.id ? 'text-blue-600' : 'text-gray-400'}`}></i>
                                                <div className="font-bold text-sm dark:text-gray-200">{role.label}</div>
                                                <div className="text-xs text-gray-500">{role.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Mégse
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Link Generálása
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-green-800 dark:text-green-300 flex items-center gap-3">
                                    <i className="fas fa-check-circle text-xl"></i>
                                    <div>
                                        <p className="font-bold">Meghívó link elkészült!</p>
                                        <p className="text-sm">Küldd el ezt a linket a kollégának:</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={inviteLink}
                                        className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-600 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg font-medium"
                                    >
                                        Másolás
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="w-full py-2 text-gray-500 hover:text-gray-700"
                                >
                                    Bezárás
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
