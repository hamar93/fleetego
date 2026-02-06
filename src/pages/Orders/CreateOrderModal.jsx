import React, { useState } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const CreateOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        order_number: '',
        pickup: { name: '', address: '', contact_name: '', contact_phone: '' },
        delivery: { name: '', address: '', contact_name: '', contact_phone: '' },
        pickup_time: '',
        delivery_time: '',
        cargo: { description: '', weight: '', volume: '', quantity: 1, package_type: 'pallet' },
        notes: ''
    });

    if (!isOpen) return null;

    const handleChange = (e, section = null, field = null) => {
        if (section) {
            setFormData({
                ...formData,
                [section]: { ...formData[section], [field]: e.target.value }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert numbers
            const payload = {
                ...formData,
                cargo: {
                    ...formData.cargo,
                    weight: parseFloat(formData.cargo.weight) || 0,
                    volume: parseFloat(formData.cargo.volume) || 0,
                    quantity: parseInt(formData.cargo.quantity) || 1
                }
            };

            await api.post('/api/orders/', payload);
            onOrderCreated(); // Refresh list
            onClose();
        } catch (error) {
            console.error("Failed to create order", error);
            alert("Hiba történt a fuvar létrehozása közben.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e293b] z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Új Fuvar Létrehozása</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuvar Azonosító</label>
                            <input
                                type="text"
                                name="order_number"
                                value={formData.order_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="pl. IMP-2024-001"
                            />
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pickup */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                📍 Felrakó (Pickup)
                            </h3>
                            <input
                                type="datetime-local"
                                name="pickup_time"
                                value={formData.pickup_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Cég neve"
                                value={formData.pickup.name}
                                onChange={(e) => handleChange(e, 'pickup', 'name')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Cím"
                                value={formData.pickup.address}
                                onChange={(e) => handleChange(e, 'pickup', 'address')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="Kapcsolattartó" value={formData.pickup.contact_name} onChange={(e) => handleChange(e, 'pickup', 'contact_name')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                <input type="text" placeholder="Telefon" value={formData.pickup.contact_phone} onChange={(e) => handleChange(e, 'pickup', 'contact_phone')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                                🏁 Lerakó (Delivery)
                            </h3>
                            <input
                                type="datetime-local"
                                name="delivery_time"
                                value={formData.delivery_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Cég neve"
                                value={formData.delivery.name}
                                onChange={(e) => handleChange(e, 'delivery', 'name')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Cím"
                                value={formData.delivery.address}
                                onChange={(e) => handleChange(e, 'delivery', 'address')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="Kapcsolattartó" value={formData.delivery.contact_name} onChange={(e) => handleChange(e, 'delivery', 'contact_name')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                <input type="text" placeholder="Telefon" value={formData.delivery.contact_phone} onChange={(e) => handleChange(e, 'delivery', 'contact_phone')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                            </div>
                        </div>
                    </div>

                    {/* Cargo */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📦 Rakomány Részletei</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Megnevezés"
                                value={formData.cargo.description}
                                onChange={(e) => handleChange(e, 'cargo', 'description')}
                                className="col-span-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                required
                            />
                            <div className="grid grid-cols-3 gap-2 col-span-2">
                                <input type="number" placeholder="Súly (kg)" value={formData.cargo.weight} onChange={(e) => handleChange(e, 'cargo', 'weight')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                <input type="number" placeholder="Térfogat (m3)" value={formData.cargo.volume} onChange={(e) => handleChange(e, 'cargo', 'volume')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                <input type="number" placeholder="Darab" value={formData.cargo.quantity} onChange={(e) => handleChange(e, 'cargo', 'quantity')} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Mentés...' : 'Fuvar Létrehozása'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
