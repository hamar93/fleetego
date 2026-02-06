import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import CreateOrderModal from './CreateOrderModal';
import { useTranslation } from 'react-i18next';

const OrdersPage = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');

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
            created: 'Létrehozva',
            assigned: 'Hozzárendelve',
            pickup: 'Felvétel',
            transit: 'Úton',
            delivered: 'Kiszállítva',
            cancelled: 'Törölve',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.created}`}>
                {labels[status] || status}
            </span>
        );
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Fuvarok Kezelése</h1>
                    <p className="text-gray-500 dark:text-gray-400">Aktív megbízások és szállítások áttekintése</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-medium transition-all hover:scale-105 flex items-center gap-2"
                >
                    <span>+</span> Új Fuvar Indítása
                </button>
            </div>

            {/* Stats/Filter Bar (Simplified) */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {['all', 'created', 'assigned', 'transit', 'delivered'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-600'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        {status === 'all' ? 'Összes' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Betöltés...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        Nincs megjeleníthető fuvar.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Azonosító</th>
                                    <th className="p-4 font-semibold">Felvétel</th>
                                    <th className="p-4 font-semibold">Lerakás</th>
                                    <th className="p-4 font-semibold">Rakomány</th>
                                    <th className="p-4 font-semibold">Státusz</th>
                                    <th className="p-4 font-semibold">Jármű</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 font-medium text-[var(--text-primary)]">
                                            {order.order_number}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-[var(--text-primary)]">{order.pickup.name}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.pickup_time).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 max-w-[150px] truncate">{order.pickup.address}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-[var(--text-primary)]">{order.delivery.name}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.delivery_time).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 max-w-[150px] truncate">{order.delivery.address}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div>{order.cargo.description}</div>
                                            <div className="text-xs text-gray-500">{order.cargo.weight} kg • {order.cargo.volume} m³</div>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                            {order.assigned_vehicle_id ? (
                                                <span className="text-blue-600 dark:text-blue-400">Járműhöz rendelve</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Nincs rendelve</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
