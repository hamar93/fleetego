import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

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
            loadUsers(); // Reload
        } catch (error) {
            console.error("Failed to approve user:", error);
            alert("Jóváhagyás sikertelen!");
        }
    };

    const handleReject = async (userId) => {
        try {
            await api.put(`/api/admin/users/${userId}/reject`);
            loadUsers(); // Reload
        } catch (error) {
            console.error("Failed to reject user:", error);
            alert("Elutasítás sikertelen!");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            default: return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Jóváhagyásra vár';
            case 'approved': return 'Jóváhagyva';
            case 'rejected': return 'Elutasítva';
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
            <div className="page-header">
                <h2 className="page-title"><i className="fas fa-users-cog"></i> Felhasználók Kezelése</h2>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Összes ({users.length})
                </button>
                <button
                    className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Függőben ({users.filter(u => u.status === 'pending').length})
                </button>
                <button
                    className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    Jóváhagyva ({users.filter(u => u.status === 'approved').length})
                </button>
                <button
                    className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    Elutasítva ({users.filter(u => u.status === 'rejected').length})
                </button>
            </div>

            {/* User Table */}
            <div className="users-table card glass-effect">
                <table>
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
                            <tr key={user.id}>
                                <td className="user-company">{user.company_name}</td>
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
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleApprove(user.id)}
                                            >
                                                <i className="fas fa-check"></i> Jóváhagy
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleReject(user.id)}
                                            >
                                                <i className="fas fa-times"></i> Elutasít
                                            </button>
                                        </>
                                    )}
                                    {user.status !== 'pending' && (
                                        <span className="no-actions">—</span>
                                    )}
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
