import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Fix import if needed, assume checkAuth logic

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            // Check scope/role
            if (decoded.role !== 'admin' || decoded.scope !== 'admin') {
                localStorage.removeItem('token'); // Invalid for admin
                navigate('/admin/login');
                return;
            }
            setUser(decoded);
        } catch (e) {
            localStorage.removeItem('token');
            navigate('/admin/login');
        }
    }, [navigate, location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    if (!user) return null; // Or loading spinner

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-wider text-red-500">FLEETEGO ADMIN</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white">
                        <i className="fas fa-users-cog"></i>
                        Dashboard
                    </Link>
                    {/* Add more admin links here */}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Kijelentkezés
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
