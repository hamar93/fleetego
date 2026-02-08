import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import CreateOrderModal from './CreateOrderModal';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details'); // details, documents, matching
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [selectedDriverId, setSelectedDriverId] = useState('');

    // Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- Documents State ---
    const [documents, setDocuments] = useState([]);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [docType, setDocType] = useState('CMR');

    const fetchDocuments = async () => {
        try {
            const res = await api.get(`/api/documents/order/${id}`);
            setDocuments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch docs on tab switch
    useEffect(() => {
        if (activeTab === 'documents') {
            fetchDocuments();
        }
    }, [activeTab]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingDoc(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', id);
        formData.append('type', docType);

        try {
            await api.post('/api/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments();

            // Automation: Suggest status update
            if (['CMR', 'POD'].includes(docType) && order.status !== 'delivered') {
                if (confirm('Dokumentum sikeresen feltöltve! Szeretné a fuvar státuszát LERAKVA (Delivered) állapotba állítani?')) {
                    await updateStatus('delivered');
                }
            }
        } catch (error) {
            alert('Feltöltési hiba!');
        } finally {
            setUploadingDoc(false);
        }
    };

    const downloadDocument = async (docId, filename) => {
        try {
            const response = await api.get(`/api/documents/download/${docId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Letöltési hiba!');
        }
    };

    const fetchMatches = async () => {
        setLoadingMatches(true);
        try {
            const res = await api.get(`/api/matches/${id}`);
            setMatches(res.data);
        } catch (error) {
            console.error("Failed to fetch matches", error);
        } finally {
            setLoadingMatches(false);
        }
    };

    // Auto-load matches when tab is switched
    useEffect(() => {
        if (activeTab === 'matching') {
            fetchMatches();
        }
    }, [activeTab]);

    const updateStatus = async (newStatus) => {
        if (!confirm('Biztosan módosítod a fuvar státuszát?')) return;

        try {
            await api.put(`/api/orders/${id}/status`, { status_update: newStatus });
            // Refresh order
            fetchOrder();
        } catch (error) {
            console.error(error);
            alert("Hiba a státusz módosításakor: " + (error.response?.data?.detail || "Ismeretlen hiba"));
        }
    };

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/orders/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchOrder();
    }, [id]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [vRes, dRes] = await Promise.all([
                    api.get('/api/fleet/vehicles'),
                    api.get('/api/fleet/drivers')
                ]);
                setVehicles(vRes.data || []);
                setDrivers(dRes.data || []);
            } catch (error) {
                console.error("Failed to fetch fleet resources", error);
            }
        };
        fetchResources();
    }, []);

    useEffect(() => {
        if (!order) return;
        if (selectedVehicleId || selectedDriverId) return;
        if (order.assigned_vehicle_id) {
            const found = vehicles.find(v =>
                v.id === order.assigned_vehicle_id || v.plate_number === order.assigned_vehicle_id
            );
            if (found) setSelectedVehicleId(found.id);
        }
        if (order.assigned_driver_id) {
            setSelectedDriverId(order.assigned_driver_id);
        }
    }, [order, vehicles, selectedVehicleId, selectedDriverId]);

    const handleManualAssign = async () => {
        try {
            setAssigning(true);
            const vehicle = vehicles.find(v => v.id === selectedVehicleId);
            await api.patch(`/api/orders/${id}`, {
                assigned_vehicle_id: vehicle ? vehicle.plate_number : null,
                assigned_driver_id: selectedDriverId || null
            });
            fetchOrder();
        } catch (error) {
            console.error("Manual assign failed", error);
            alert("Hiba a hozzárendelés mentésekor.");
        } finally {
            setAssigning(false);
        }
    };

    const handleUnassign = async () => {
        try {
            setAssigning(true);
            await api.patch(`/api/orders/${id}`, {
                assigned_vehicle_id: null,
                assigned_driver_id: null
            });
            setSelectedVehicleId('');
            setSelectedDriverId('');
            fetchOrder();
        } catch (error) {
            console.error("Unassign failed", error);
            alert("Hiba a hozzárendelés törlésekor.");
        } finally {
            setAssigning(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            // Open in new tab
            const token = localStorage.getItem('token');
            // We can use a direct link if we handle auth via cookie or query param, 
            // but for Bearer token we might need to fetch blob or use a special tailored link.
            // Simplest for now: fetch blob and open.
            const response = await api.get(`/api/orders/${id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('target', '_blank'); // Open in new tab
            // For HTML usually we just want to open it
            window.open(url, '_blank');
        } catch (error) {
            console.error(error);
            alert("Hiba a PDF letöltésekor.");
        }
    };

    const handleOrderUpdated = () => {
        fetchOrder();
        setIsEditModalOpen(false);
    };

    const getStatusStep = (status) => {
        const steps = ['created', 'assigned', 'pickup', 'transit', 'delivered'];
        return steps.indexOf(status);
    };

    const getStatusProgress = (status) => {
        const step = getStatusStep(status);
        return step * 25; // 4 intervals (0, 25, 50, 75, 100)
    };

    const getStatusLabel = (status) => {
        const labels = {
            created: 'Létrehozva',
            assigned: 'Kiosztva',
            pickup: 'Felvétel',
            transit: 'Úton',
            delivered: 'Lerakva',
            cancelled: 'Törölve'
        };
        return labels[status] || status;
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Betöltés...</div>;
    if (!order) return <div className="p-12 text-center text-gray-500">Fuvar nem található.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-blue-600 mb-2">← Vissza a listához</button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{order.order_number}</h1>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Action Buttons based on Status */}
                    {order.status === 'created' && (
                        <button
                            disabled // Needs assignment first
                            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Várakozás járműre
                        </button>
                    )}
                    {order.status === 'assigned' && (
                        <button
                            onClick={() => updateStatus('pickup')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                        >
                            Jármű elindult (→ Felvétel)
                        </button>
                    )}
                    {order.status === 'pickup' && (
                        <button
                            onClick={() => updateStatus('transit')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                        >
                            Áru felvéve (→ Úton)
                        </button>
                    )}
                    {order.status === 'transit' && (
                        <button
                            onClick={() => updateStatus('delivered')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                        >
                            Áru lerakva (→ Kész)
                        </button>
                    )}

                    <button
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        📄 PDF
                    </button>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        ✏️ Szerkesztés
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            <CreateOrderModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onOrderCreated={handleOrderUpdated}
                orderToEdit={order}
            />

            {/* Status Stepper */}
            <div className="mb-8 overflow-x-auto">
                <div className="min-w-[700px] flex justify-between items-center relative">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full"></div>

                    {/* Progress Bar Fill */}
                    <div
                        className="absolute left-0 top-1/2 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                    ></div>

                    {['created', 'assigned', 'pickup', 'transit', 'delivered'].map((step, index) => {
                        const isCompleted = getStatusStep(order.status) > index;
                        const isCurrent = getStatusStep(order.status) === index;

                        return (
                            <div key={step} className="flex flex-col items-center gap-2 bg-white dark:bg-[#0f172a] px-2 py-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                        isCurrent ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30' :
                                            'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                <span className={`text-xs font-medium uppercase tracking-wider ${isCurrent || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {getStatusLabel(step)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    Részletek
                </button>
                <button
                    onClick={() => setActiveTab('matching')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'matching' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    🤖 Intelligens Ajánló
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'documents' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    📄 Dokumentumok
                </button>
            </div>

            {/* Tab Content: Details */}
            {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Route Card */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Útvonal</h3>
                            <div className="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 space-y-8">
                                {/* Pickup */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] top-1 bg-blue-500 rounded-full w-4 h-4 ring-4 ring-white dark:ring-[#1e293b]"></div>
                                    <div className="mb-1">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Felrakó (Tervezett)</p>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {new Date(order.pickup_time).toLocaleString()}
                                        </p>
                                        {order.actual_pickup_time && (
                                            <div className="mt-1 flex items-center gap-1 text-green-600 dark:text-green-400">
                                                <span className="text-xs">✅ Tényleges:</span>
                                                <span className="text-sm font-bold">{new Date(order.actual_pickup_time).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-medium text-[var(--text-primary)]">{order.pickup?.name || "Nincs megadva"}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.pickup?.zip_code} {order.pickup?.city}, {order.pickup?.address}
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {order.pickup?.time_window && (
                                            <p className="text-sm text-gray-500">
                                                🕒 <span className="font-semibold">Időkapu:</span> {order.pickup?.time_window}
                                            </p>
                                        )}
                                        {order.pickup?.reference_number && (
                                            <p className="text-sm text-gray-500">
                                                🔢 <span className="font-semibold">Ref:</span> {order.pickup?.reference_number}
                                            </p>
                                        )}
                                        {order.pickup?.contact_name && (
                                            <p className="text-sm text-gray-500">📞 {order.pickup?.contact_name} ({order.pickup?.contact_phone})</p>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] top-1 bg-green-500 rounded-full w-4 h-4 ring-4 ring-white dark:ring-[#1e293b]"></div>
                                    <div className="mb-1">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Lerakó (Tervezett)</p>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {order.delivery_time ? new Date(order.delivery_time).toLocaleString() : '-'}
                                        </p>
                                        {order.actual_delivery_time && (
                                            <div className="mt-1 flex items-center gap-1 text-green-600 dark:text-green-400">
                                                <span className="text-xs">✅ Tényleges:</span>
                                                <span className="text-sm font-bold">{new Date(order.actual_delivery_time).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-medium text-[var(--text-primary)]">{order.delivery?.name || "Nincs megadva"}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.delivery?.zip_code} {order.delivery?.city}, {order.delivery?.address}
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {order.delivery?.time_window && (
                                            <p className="text-sm text-gray-500">
                                                🕒 <span className="font-semibold">Időkapu:</span> {order.delivery?.time_window}
                                            </p>
                                        )}
                                        {order.delivery?.reference_number && (
                                            <p className="text-sm text-gray-500">
                                                🔢 <span className="font-semibold">Ref:</span> {order.delivery?.reference_number}
                                            </p>
                                        )}
                                        {order.delivery?.contact_name && (
                                            <p className="text-sm text-gray-500">📞 {order.delivery?.contact_name} ({order.delivery?.contact_phone})</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cargo Card */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Rakomány</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-xs text-gray-500">Megnevezés</p>
                                    <p className="font-medium text-[var(--text-primary)]">{order.cargo?.description}</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-xs text-gray-500">Súly</p>
                                    <p className="font-medium text-[var(--text-primary)]">{order.cargo?.weight} kg</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-xs text-gray-500">Térfogat</p>
                                    <p className="font-medium text-[var(--text-primary)]">{order.cargo?.volume} m³</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-xs text-gray-500">LDM</p>
                                    <p className="font-medium text-[var(--text-primary)]">{order.cargo?.loading_meters || '-'} LDM</p>
                                </div>
                            </div>
                            {/* ADR Badge if Applicable */}
                            {order.cargo?.is_adr && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-center gap-3">
                                    <span className="text-2xl">☢️</span>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 dark:text-red-400">Veszélyes Áru (ADR)</p>
                                        <p className="text-xs text-red-600 dark:text-red-300">Osztály: {order.cargo?.adr_class} • UN: {order.cargo?.adr_un_number}</p>
                                    </div>
                                </div>
                            )}
                            {order.notes && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-100 dark:border-yellow-900/30">
                                    📝 <strong>Megjegyzés:</strong> {order.notes}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right Column: Docs & Assignment */}
                    <div className="space-y-6">
                        {/* Assignment */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Erőforrás</h3>

                            {order.subcontractor_name ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                        <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase">Alvállalkozó</span>
                                        <p className="font-bold text-lg text-[var(--text-primary)]">{order.subcontractor_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Rendszám</p>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <span className="font-medium text-[var(--text-primary)]">{order.subcontractor_plate || '-'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Sofőr / Kontakt</p>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <p className="font-medium text-[var(--text-primary)]">{order.subcontractor_driver || '-'}</p>
                                            <p className="text-xs text-gray-500">{order.subcontractor_contact}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Jármű</p>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                            <span className="font-medium text-[var(--text-primary)]">
                                                {order.assigned_vehicle_id ? (order.assigned_vehicle_id) : "Nincs hozzárendelve"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Sofőr</p>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                            <span className="font-medium text-[var(--text-primary)]">
                                                {order.assigned_driver_id ? (order.assigned_driver_id) : "Nincs hozzárendelve"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 mb-2 font-semibold">Manuális hozzárendelés</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <select
                                                    value={selectedVehicleId}
                                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                >
                                                    <option value="">-- Jármű választása --</option>
                                                    {vehicles.map(v => (
                                                        <option key={v.id} value={v.id}>{v.plate_number} ({v.type})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <select
                                                    value={selectedDriverId}
                                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                >
                                                    <option value="">-- Sofőr választása --</option>
                                                    {drivers.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleManualAssign}
                                                    disabled={assigning}
                                                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                                                >
                                                    {assigning ? 'Mentés...' : 'Hozzárendelés mentése'}
                                                </button>
                                                <button
                                                    onClick={handleUnassign}
                                                    disabled={assigning}
                                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                                                >
                                                    Leoldás
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('matching')} className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                        🤖 Intelligens Ajánló
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">💰 Árazás</h3>
                            {order.price_value > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Típus:</span>
                                        <span className="font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                                            {order.price_type === 'FIX' ? 'Fix Díj' : 'Díj / Km'}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                                        {order.price_value} {order.currency}
                                    </div>
                                    {order.price_type === 'PER_KM' && (
                                        <p className="text-xs text-gray-400">A végösszeg a megtett távolság alapján kerül kiszámításra.</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Nincs ár megadva.</p>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            {/* Tab Content: Documents */}
            {
                activeTab === 'documents' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fuvar Dokumentumok</h3>
                                <p className="text-sm text-gray-500">CMR, Szállítólevél, POD és egyéb fájlok kezelése.</p>
                            </div>

                            <div className="flex gap-3 items-center">
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="CMR">CMR</option>
                                    <option value="POD">POD (Igazolás)</option>
                                    <option value="INVOICE">Számla</option>
                                    <option value="OTHER">Egyéb</option>
                                </select>

                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="doc-upload"
                                        disabled={uploadingDoc}
                                    />
                                    <label
                                        htmlFor="doc-upload"
                                        className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 ${uploadingDoc ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        {uploadingDoc ? 'Feltöltés...' : (
                                            <>
                                                <span>+</span> Feltöltés
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {documents.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="text-4xl mb-4">📂</div>
                                    <p className="text-gray-500 text-lg">Nincs feltöltött dokumentum ehhez a fuvarhoz.</p>
                                    <p className="text-gray-400 text-sm">Töltsd fel a CMR-t vagy a teljesítés igazolását.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4">Fájlnév</th>
                                            <th className="px-6 py-4">Típus</th>
                                            <th className="px-6 py-4">Feltöltve</th>
                                            <th className="px-6 py-4 text-right">Művelet</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {documents.map(doc => (
                                            <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                            📄
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">{doc.original_filename}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold">
                                                        {doc.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    <span className="text-gray-400 text-xs ml-2">
                                                        ({new Date(doc.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => downloadDocument(doc.id, doc.original_filename)}
                                                        className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                                                    >
                                                        ⬇ Letöltés
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Tab Content: Matching */}
            {
                activeTab === 'matching' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                            <h2 className="text-2xl font-bold mb-2">🤖 Auto-Match Segéd</h2>
                            <p className="opacity-90 max-w-2xl">
                                Az algoritmus elemzi a járművek kapacitását (Súly, LDM, ADR) és a sofőrök vezetési idejét (561/2006/EK), hogy megtalálja a legoptimálisabb párosítást.
                            </p>
                        </div>

                        {loadingMatches ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-500">Járművek és sofőrök elemzése...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matches.map((match, idx) => (
                                    <div key={idx} className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Score Header */}
                                        <div className={`p-4 flex justify-between items-center ${match.score >= 80 ? 'bg-green-50/50 dark:bg-green-900/20' :
                                            match.score >= 50 ? 'bg-yellow-50/50 dark:bg-yellow-900/20' :
                                                'bg-red-50/50 dark:bg-red-900/20'
                                            }`}>
                                            <span className="font-bold text-lg text-[var(--text-primary)]">
                                                {match.vehicle.plate}
                                            </span>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${match.score >= 80 ? 'bg-green-100 text-green-700' :
                                                match.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {match.score}% Egyezés
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                                                    🚛
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">{match.vehicle.type}</p>
                                                    <p className="text-xs text-gray-500">Jármű</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                                                    👨‍✈️
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">{match.driver.name}</p>
                                                    <p className="text-xs text-gray-500">Sofőr</p>
                                                </div>
                                            </div>

                                            {match.warnings.length > 0 && (
                                                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs space-y-1">
                                                    {match.warnings.map((w, i) => (
                                                        <p key={i} className="text-red-600 dark:text-red-400 flex gap-2">
                                                            ⚠️ {w}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}

                                            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all">
                                                Kiválasztás
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {matches.length === 0 && (
                                    <div className="col-span-full p-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        Nincs elérhető jármű, amely megfelelne a szűrőknek.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default OrderDetails;
