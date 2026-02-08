import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes, ordersRes] = await Promise.all([
                    api.get('/api/dashboard/stats'),
                    api.get('/api/dashboard/activity'),
                    api.get('/api/orders') // Fetch recent orders to check for alerts
                ]);
                setStats(statsRes.data);
                setActivity(activityRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Dashboard data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const normalizeAppLink = (link) => {
        if (!link || typeof link !== 'string') return '/app/dashboard';
        if (link.startsWith('/app/') || link.startsWith('/admin') || link.startsWith('http')) return link;
        if (link.startsWith('/orders/')) return `/app/shipments/${link.replace('/orders/', '')}`;
        if (link.startsWith('/')) return `/app${link}`;
        return `/app/${link}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6 text-[var(--text-primary)]">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{t('dashboard.welcome')}</p>
                    </div>
                    <Link
                        to="/app/shipments/active?new=1"
                        className="w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <span>+</span> {t('dashboard.new_shipment_btn').replace('+ ', '')}
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Active Orders */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 text-xl font-bold">
                                📦
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{t('dashboard.active_orders.tag')}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats?.active_orders_count || 0}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.active_orders.label')}</p>
                    </div>

                    {/* Pending Revenue */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400 text-xl font-bold">
                                💰
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded flex items-center gap-1">
                                ↗ {t('dashboard.revenue.tag')}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stats?.revenue_this_month?.toLocaleString()} {stats?.currency}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.revenue.label')}</p>
                    </div>

                    {/* Fleet Status (Active) */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                                🚛
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.fleet_status?.active || 0}</h3>
                            <span className="text-gray-400 text-sm">/ {stats?.fleet_status?.total || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.fleet_active.label')}</p>
                    </div>

                    {/* Fleet Status (Available) */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 text-xl font-bold">
                                🅿️
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{t('dashboard.fleet_available.tag')}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats?.fleet_status?.available || 0}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.fleet_available.label')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Action Required Section (Dispatch Copilot) */}
                        {orders.some(o => o.alert_status && o.alert_status !== 'OK') && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 animate-pulse-slow">
                                <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                                    ⚠️ {t('dashboard.action_required')}
                                </h2>
                                <div className="space-y-3">
                                    {orders.filter(o => o.alert_status && o.alert_status !== 'OK').map(order => (
                                        <div key={order.id} className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 dark:text-white">{order.order_number}</span>
                                                    <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded font-bold">
                                                        {order.alert_message}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {order.pickup.city} ➝ {order.delivery.city} • {t(`status.${order.status}`)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/app/shipments/${order.id}`}
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                                                >
                                                    Részletek
                                                </Link>
                                                {/* Snooze (Stub) */}
                                                <button className="px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
                                                    💤
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Feed */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('dashboard.recent_activity')}</h2>
                            <div className="space-y-6">
                                {activity.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8 opacity-60">{t('dashboard.no_activity')}</p>
                                ) : (
                                    activity.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 
                                                ${item.type === 'order_created' ? 'bg-blue-500' : 'bg-purple-500'}
                                                ring-4 ring-white dark:ring-[#1e293b]`}
                                            ></div>
                                            <Link to={normalizeAppLink(item.link)} className="flex-1 pb-6 border-l-2 border-gray-100 dark:border-gray-700 pl-6 -ml-[23px] group-last:border-transparent group-last:pb-0">
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                                        <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Access / Mini Stats */}
                    <div className="space-y-6">
                        {/* Revenue Chart Placeholder (CSS Only) */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.revenue_trend')}</h2>
                            <p className="text-xs text-gray-500 mb-6">{t('dashboard.last_6_months')}</p>

                            <div className="flex items-end justify-between h-40 gap-2">
                                {/* Dummy Data Bars */}
                                {[40, 65, 45, 80, 55, 90].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-sm relative group overflow-hidden">
                                        <div
                                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500 group-hover:bg-blue-500"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>{t('dashboard.months.aug')}</span>
                                <span>{t('dashboard.months.sep')}</span>
                                <span>{t('dashboard.months.oct')}</span>
                                <span>{t('dashboard.months.nov')}</span>
                                <span>{t('dashboard.months.dec')}</span>
                                <span>{t('dashboard.months.jan')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
