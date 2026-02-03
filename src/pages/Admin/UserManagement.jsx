import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, blocked

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await api.put(`/api/admin/users/${userId}/approve`);
            loadUsers();
        } catch (error) {
            console.error("Failed to approve user:", error);
            alert("Jóváhagyás sikertelen!");
        }
    };

    const handleReject = async (userId) => {
        try {
            await api.put(`/api/admin/users/${userId}/reject`);
            loadUsers();
        } catch (error) {
            console.error("Failed to reject user:", error);
            alert("Elutasítás sikertelen!");
        }
    };

    const handleBlock = async (userId) => {
        if (!window.confirm("Biztosan blokkolni szeretné ezt a felhasználót?")) return;
        try {
            await api.put(`/api/admin/users/${userId}/block`);
            loadUsers();
        } catch (error) {
            console.error("Failed to block user:", error);
            alert("Blokkolás sikertelen!");
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await api.put(`/api/admin/users/${userId}/unblock`);
            loadUsers();
        } catch (error) {
            console.error("Failed to unblock user:", error);
            alert("Feloldás sikertelen!");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'blocked': return 'status-blocked';
            default: return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Jóváhagyásra vár';
            case 'approved': return 'Jóváhagyva';
            case 'rejected': return 'Elutasítva';
            case 'blocked': return 'Blokkolva';
            default: return status;
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.status === filter;
    });

    if (loading) {
        return (
            <div className="user-management-container fade-in">
                <h2 className="page-title"><i className="fas fa-users-cog"></i> Felhasználók Kezelése</h2>
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p>Betöltés...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management-container fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 className="page-title header-title" style={{ fontSize: '2rem' }}>Felhasználók Kezelése</h2>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['all', 'pending', 'approved', 'rejected', 'blocked'].map(f => (
                    <button
                        key={f}
                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'Összes' : getStatusLabel(f)} ({f === 'all' ? users.length : users.filter(u => u.status === f).length})
                    </button>
                ))}
            </div>

            {/* User Table */}
            <div className="users-table glass-effect content-card" style={{ padding: '0' }}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Cégnév</th>
                            <th>Email</th>
                            <th>Szerepkör</th>
                            <th>Státusz</th>
                            <th>Regisztráció</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="glow-on-hover">
                                <td className="user-company" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{user.company_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role === 'admin' ? 'Admin' : 'Felhasználó'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                                        {getStatusLabel(user.status)}
                                    </span>
                                </td>
                                <td className="user-date">
                                    {new Date(user.created_at).toLocaleDateString('hu-HU')}
                                </td>
                                <td className="user-actions">
                                    {user.status === 'pending' && (
                                        <>
                                            <button className="btn-sm btn-outline-primary" onClick={() => handleApprove(user.id)}>
                                                <i className="fas fa-check"></i>
                                            </button>
                                            <button className="btn-sm btn-outline-secondary" onClick={() => handleReject(user.id)}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </>
                                    )}
                                    {user.status === 'approved' && (
                                        <button className="btn-sm btn-outline-secondary" onClick={() => handleBlock(user.id)} title="Blokkolás">
                                            <i className="fas fa-ban"></i>
                                        </button>
                                    )}
                                    {user.status === 'blocked' && (
                                        <button className="btn-sm btn-outline-primary" onClick={() => handleUnblock(user.id)} title="Feloldás">
                                            <i className="fas fa-unlock"></i>
                                        </button>
                                    )}
                                    {user.status === 'rejected' && <span className="no-actions">—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <i className="fas fa-users fa-3x"></i>
                        <p>Nincs megjeleníthető felhasználó ebben a kategóriában.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
