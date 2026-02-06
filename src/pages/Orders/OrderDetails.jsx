import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/api/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'cmr'); // Default to CMR for now, could be a dropdown

        try {
            await api.post(`/api/orders/${id}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchOrder(); // Refresh to show new doc
        } catch (error) {
            console.error("Upload failed", error);
            alert("Sikertelen feltöltés!");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Betöltés...</div>;
    if (!order) return <div className="p-12 text-center text-gray-500">Fuvar nem található.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-blue-600 mb-2">← Vissza a listához</button>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">{order.order_number}</h1>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {order.status.toUpperCase()}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Szerkesztés
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        Törlés
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Route Card */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Útvonal</h3>
                        <div className="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 space-y-8">
                            {/* Pickup */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 bg-blue-500 rounded-full w-4 h-4 ring-4 ring-white dark:ring-[#1e293b]"></div>
                                <p className="text-sm text-gray-500 mb-1">Felrakó • {new Date(order.pickup_time).toLocaleString()}</p>
                                <h4 className="text-lg font-medium text-[var(--text-primary)]">{order.pickup.name}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{order.pickup.address}</p>
                                {order.pickup.contact_name && (
                                    <p className="text-sm text-gray-500 mt-1">📞 {order.pickup.contact_name} ({order.pickup.contact_phone})</p>
                                )}
                            </div>

                            {/* Delivery */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 bg-green-500 rounded-full w-4 h-4 ring-4 ring-white dark:ring-[#1e293b]"></div>
                                <p className="text-sm text-gray-500 mb-1">Lerakó • {new Date(order.delivery_time).toLocaleString()}</p>
                                <h4 className="text-lg font-medium text-[var(--text-primary)]">{order.delivery.name}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{order.delivery.address}</p>
                                {order.delivery.contact_name && (
                                    <p className="text-sm text-gray-500 mt-1">📞 {order.delivery.contact_name} ({order.delivery.contact_phone})</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cargo Card */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Rakomány</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">Megnevezés</p>
                                <p className="font-medium text-[var(--text-primary)]">{order.cargo.description}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">Súly</p>
                                <p className="font-medium text-[var(--text-primary)]">{order.cargo.weight} kg</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">Térfogat</p>
                                <p className="font-medium text-[var(--text-primary)]">{order.cargo.volume} m³</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">Darab</p>
                                <p className="font-medium text-[var(--text-primary)]">{order.cargo.quantity} db</p>
                            </div>
                        </div>
                        {order.notes && (
                            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-100 dark:border-yellow-900/30">
                                📝 <strong>Megjegyzés:</strong> {order.notes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Docs & Assignment */}
                <div className="space-y-6">
                    {/* Documents */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Dokumentumok</h3>

                        {/* File List */}
                        <div className="space-y-3 mb-6">
                            {order.documents && order.documents.length > 0 ? (
                                order.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                {doc.type}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.filename}</p>
                                                <p className="text-xs text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-blue-600 p-1">
                                            ⬇
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4 italic">Nincs feltöltött dokumentum.</p>
                            )}
                        </div>

                        {/* Upload Button */}
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="text-2xl mb-2">📎</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Kattints a feltöltéshez</span> vagy húzd ide</p>
                                <p className="text-xs text-gray-400">CMR, Szállítólevél, Fotó</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                        {uploading && <p className="text-sm text-blue-500 text-center mt-2">Feltöltés folyamatban...</p>}
                    </div>

                    {/* Assignment */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Erőforrás</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Jármű</p>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                    <span className="font-medium text-[var(--text-primary)]">
                                        {order.assigned_vehicle_id ? "Rendszám betöltése..." : "Nincs hozzárendelve"}
                                        {/* TODO: Resolve Vehicle ID to Plate Number using Fleet Context or separate fetch */}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Sofőr</p>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                    <span className="font-medium text-[var(--text-primary)]">
                                        {order.assigned_driver_id ? "Sofőr betöltése..." : "Nincs hozzárendelve"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
