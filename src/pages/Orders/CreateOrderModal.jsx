import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const CreateOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);

    // Initial State
    const initialFormData = {
        order_number: '',
        pickup: { name: '', address: '', contact_name: '', contact_phone: '' },
        delivery: { name: '', address: '', contact_name: '', contact_phone: '' },
        pickup_time: '',
        delivery_time: '',
        cargo: { description: '', weight: '', volume: '', quantity: 1, package_type: 'pallet' },
        notes: '',
        assigned_vehicle_id: '',
        assigned_driver_id: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch resources when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchResources = async () => {
                try {
                    const [vRes, dRes] = await Promise.all([
                        api.get('/api/fleet/vehicles'),
                        api.get('/api/fleet/drivers')
                    ]);
                    setVehicles(vRes.data);
                    setDrivers(dRes.data);
                } catch (error) {
                    console.error("Failed to fetch fleet resources:", error);
                }
            };
            fetchResources();
        }
    }, [isOpen]);

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

    // Handle vehicle selection specifically to auto-select driver if needed
    const handleVehicleChange = (e) => {
        const vehicleId = e.target.value;
        const vehicle = vehicles.find(v => v.id === vehicleId);

        setFormData(prev => ({
            ...prev,
            assigned_vehicle_id: vehicleId,
            // Optional: Auto-select driver if vehicle has one assigned? 
            // For now, let user select driver manually or leave as is.
            assigned_driver_id: vehicle && vehicle.current_driver_id ? vehicle.current_driver_id : prev.assigned_driver_id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert numbers
            const payload = {
                ...formData,
                // Remove empty strings for optional fields to let backend generate defaults
                order_number: formData.order_number || undefined,
                assigned_vehicle_id: formData.assigned_vehicle_id || null,
                assigned_driver_id: formData.assigned_driver_id || null,

                cargo: {
                    ...formData.cargo,
                    weight: parseFloat(formData.cargo.weight) || 0,
                    volume: parseFloat(formData.cargo.volume) || 0,
                    quantity: parseInt(formData.cargo.quantity) || 1
                }
            };

            await api.post('/api/orders/', payload);
            if (onOrderCreated) onOrderCreated();
            onClose();
            setFormData(initialFormData); // Reset form
        } catch (error) {
            console.error("Failed to create order", error);
            alert("Hiba történt a fuvar létrehozása közben.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e293b] z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Új Fuvar Rögzítése</h2>
                        <p className="text-sm text-gray-500">Azonosító automatikusan generálódik mentéskor.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-xl">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8 grow overflow-y-auto pt-8">
                    {/* Basic Info & Assignments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <label className={labelClasses}>Fuvar Azonosító</label>
                            <input
                                type="text"
                                name="order_number"
                                value={formData.order_number}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Automatikusan generálás (vagy írja be kézzel)"
                            />
                            <p className="text-xs text-gray-500 mt-1">Hagyja üresen az automatikus generáláshoz, vagy írja be külső megbízásnál.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Jármű Hozzárendelés</label>
                                <select
                                    name="assigned_vehicle_id"
                                    value={formData.assigned_vehicle_id}
                                    onChange={handleVehicleChange}
                                    className={inputClasses}
                                >
                                    <option value="">-- Nincs kiválasztva --</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.plate_number} ({v.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Sofőr Hozzárendelés</label>
                                <select
                                    name="assigned_driver_id"
                                    value={formData.assigned_driver_id}
                                    onChange={handleChange}
                                    className={inputClasses}
                                >
                                    <option value="">-- Nincs kiválasztva --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pickup */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 border-b border-blue-100 dark:border-blue-900 pb-2">
                                📍 Felrakó (Pickup)
                            </h3>
                            <div>
                                <label className={labelClasses}>Időpont</label>
                                <input type="datetime-local" name="pickup_time" value={formData.pickup_time} onChange={handleChange} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Cég Neve</label>
                                <input type="text" placeholder="Pl. Gyár Kft." value={formData.pickup.name} onChange={(e) => handleChange(e, 'pickup', 'name')} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Cím</label>
                                <input type="text" placeholder="Város, Utca, Házszám" value={formData.pickup.address} onChange={(e) => handleChange(e, 'pickup', 'address')} className={inputClasses} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Kapcsolattartó" value={formData.pickup.contact_name} onChange={(e) => handleChange(e, 'pickup', 'contact_name')} className={inputClasses} />
                                <input type="text" placeholder="Telefon" value={formData.pickup.contact_phone} onChange={(e) => handleChange(e, 'pickup', 'contact_phone')} className={inputClasses} />
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2 border-b border-green-100 dark:border-green-900 pb-2">
                                🏁 Lerakó (Delivery)
                            </h3>
                            <div>
                                <label className={labelClasses}>Időpont</label>
                                <input type="datetime-local" name="delivery_time" value={formData.delivery_time} onChange={handleChange} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Cég Neve</label>
                                <input type="text" placeholder="Pl. Raktár Zrt." value={formData.delivery.name} onChange={(e) => handleChange(e, 'delivery', 'name')} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Cím</label>
                                <input type="text" placeholder="Város, Utca, Házszám" value={formData.delivery.address} onChange={(e) => handleChange(e, 'delivery', 'address')} className={inputClasses} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Kapcsolattartó" value={formData.delivery.contact_name} onChange={(e) => handleChange(e, 'delivery', 'contact_name')} className={inputClasses} />
                                <input type="text" placeholder="Telefon" value={formData.delivery.contact_phone} onChange={(e) => handleChange(e, 'delivery', 'contact_phone')} className={inputClasses} />
                            </div>
                        </div>
                    </div>

                    {/* Cargo */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📦 Rakomány Részletei</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelClasses}>Megnevezés</label>
                                <input type="text" placeholder="Pl. Autóalkatrészek" value={formData.cargo.description} onChange={(e) => handleChange(e, 'cargo', 'description')} className={inputClasses} required />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 col-span-2">
                                <div>
                                    <label className={labelClasses}>Súly (kg)</label>
                                    <input type="number" placeholder="0" value={formData.cargo.weight} onChange={(e) => handleChange(e, 'cargo', 'weight')} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Térfogat (m³)</label>
                                    <input type="number" placeholder="0" value={formData.cargo.volume} onChange={(e) => handleChange(e, 'cargo', 'volume')} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>LDM (Ládaméter)</label>
                                    <input type="number" step="0.1" placeholder="pl. 13.6" value={formData.cargo.loading_meters || ''} onChange={(e) => handleChange(e, 'cargo', 'loading_meters')} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Darab</label>
                                    <input type="number" placeholder="1" value={formData.cargo.quantity} onChange={(e) => handleChange(e, 'cargo', 'quantity')} className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ADR & Stackable Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ADR */}
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                            <label className="flex items-center space-x-2 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    name="cargo.is_adr"
                                    checked={formData.cargo.is_adr || false}
                                    onChange={(e) => handleChange({ target: { name: 'cargo.is_adr', value: e.target.checked } })}
                                    className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                />
                                <span className="font-bold text-red-700 dark:text-red-400">Veszélyes Áru (ADR)</span>
                            </label>

                            {formData.cargo.is_adr && (
                                <div className="grid grid-cols-2 gap-4 mt-3 animate-fadeIn">
                                    <div>
                                        <label className={labelClasses}>ADR Osztály</label>
                                        <input
                                            type="text"
                                            value={formData.cargo.adr_class || ''}
                                            onChange={(e) => handleChange(e, 'cargo', 'adr_class')}
                                            className={inputClasses}
                                            placeholder="pl. 3 (Gyúlékony)"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>UN Szám</label>
                                        <input
                                            type="text"
                                            value={formData.cargo.adr_un_number || ''}
                                            onChange={(e) => handleChange(e, 'cargo', 'adr_un_number')}
                                            className={inputClasses}
                                            placeholder="pl. 1203"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stackable */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer w-full">
                                <input
                                    type="checkbox"
                                    name="cargo.is_stackable"
                                    checked={formData.cargo.is_stackable || false}
                                    onChange={(e) => handleChange({ target: { name: 'cargo.is_stackable', value: e.target.checked } })}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <div className="ml-2">
                                    <span className="font-bold text-blue-700 dark:text-blue-400 block">Rakatolható</span>
                                    <span className="text-xs text-blue-600/70 dark:text-blue-400/70">Az áru egymásra rakható (Stackable)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-[#1e293b] pb-2">
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
                            {loading ? 'Mentés...' : 'Fuvar Rögzítése'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
