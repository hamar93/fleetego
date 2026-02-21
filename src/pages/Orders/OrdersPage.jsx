import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/api';
import CreateOrderModal from './CreateOrderModal';
import { useTranslation } from 'react-i18next';

const OrdersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/orders/');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (searchParams.get('new') === '1' && !isModalOpen) {
            setIsModalOpen(true);
            const next = new URLSearchParams(searchParams);
            next.delete('new');
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams, isModalOpen]);

    const getStatusBadge = (status) => {
        const styles = {
            created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            assigned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            pickup: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            transit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        };
        const labels = {
            created: t('orders_page.filters.created'),
            assigned: t('orders_page.filters.assigned'),
            pickup: t('status.pickup'),
            transit: t('orders_page.filters.transit'),
            delivered: t('orders_page.filters.delivered'),
            cancelled: t('status.cancelled'),
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${styles[status] || styles.created}`}>
                {labels[status] || status}
            </span>
        );
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{t('orders_page.title')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('orders_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm font-medium transition-colors flex items-center gap-2 text-sm"
                >
                    <i className="fas fa-plus"></i> {t('orders_page.new_order_btn')}
                </button>
            </div>

            {/* Stats/Filter Bar (Simplified) */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                {['all', 'created', 'assigned', 'transit', 'delivered'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                            }`}
                    >
                        {status === 'all' ? t('orders_page.filters.all') : t(`orders_page.filters.${status}`)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 text-sm">{t('orders_page.table.loading')}</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {t('orders_page.table.empty')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <table className="hidden md:table w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-3 font-semibold">{t('orders_page.table.id')}</th>
                                    <th className="p-3 font-semibold">{t('orders_page.table.pickup')}</th>
                                    <th className="p-3 font-semibold">{t('orders_page.table.delivery')}</th>
                                    <th className="p-3 font-semibold">{t('orders_page.table.cargo')}</th>
                                    <th className="p-3 font-semibold">{t('orders_page.table.status')}</th>
                                    <th className="p-3 font-semibold">{t('orders_page.table.vehicle')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
                                {filteredOrders.map(order => (
                                    <tr
                                        key={order.id}
                                        onClick={() => navigate(`/app/shipments/${order.id}`)}
                                        className="hover:bg-blue-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="p-3 font-medium text-[var(--text-primary)]">
                                            {order.order_number}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-[var(--text-primary)]">{order.pickup.name}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.pickup_time).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 max-w-[150px] truncate">{order.pickup.address}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-[var(--text-primary)]">{order.delivery.name}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.delivery_time).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 max-w-[150px] truncate">{order.delivery.address}</div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="truncate max-w-[150px]">{order.cargo.description}</div>
                                            <div className="text-xs text-gray-500">{order.cargo.weight} kg • {order.cargo.volume} m³</div>
                                        </td>
                                        <td className="p-3">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                                            {order.assigned_vehicle_id ? (
                                                <span className="text-blue-600 dark:text-blue-400 font-medium"><i className="fas fa-truck mr-1"></i> {t('orders_page.vehicle_assigned')}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">{t('orders_page.vehicle_unassigned')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50">
                            {filteredOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/app/shipments/${order.id}`)}
                                    className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700 active:scale-95 transition-transform"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-sm font-bold text-[var(--text-primary)]">{order.order_number}</span>
                                            <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="space-y-3 relative pl-4 border-l-2 border-dashed border-gray-300 dark:border-gray-600 ml-1">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-800"></div>
                                            <div className="text-sm font-medium text-[var(--text-primary)]">{order.pickup.city}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.pickup_time).toLocaleDateString()}</div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
                                            <div className="text-sm font-medium text-[var(--text-primary)]">{order.delivery.city}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.delivery_time).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            {order.cargo.weight} kg • {order.cargo.volume} m³
                                        </div>
                                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                            {t('orders_page.details_link')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CreateOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onOrderCreated={fetchOrders}
            />
        </div>
    );
};

export default OrdersPage;
