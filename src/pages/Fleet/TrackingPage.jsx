import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const TrackingPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const res = await api.get('/api/fleet/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📍 Jármű Nyomon Követés</h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* List View */}
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                        Járműlista ({vehicles.length})
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loading ? (
                            <div className="text-center p-4">Betöltés...</div>
                        ) : (
                            vehicles.map(v => (
                                <div key={v.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <i className={`fas ${v.type === 'truck' ? 'fa-truck' : v.type === 'trailer' ? 'fa-trailer' : 'fa-car'} text-gray-400`}></i>
                                                {v.plate_number}
                                            </div>
                                            <div className="text-xs text-gray-500">{v.make} {v.model}</div>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium 
                                            ${v.status === 'active' ? 'bg-green-100 text-green-700' :
                                                v.status === 'idle' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                                            {v.status === 'active' ? 'Úton' : v.status === 'idle' ? 'Szabad' : v.status}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-red-500"></i>
                                        {v.location || 'Ismeretlen pozíció'}
                                    </div>
                                    {v.current_driver_name && (
                                        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                            <i className="fas fa-user"></i>
                                            {v.current_driver_name}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=16.0,45.5,23.0,48.5&amp;layer=mapnik"
                        style={{ filter: 'grayscale(0.5) opacity(0.8)' }}
                    ></iframe>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
                        <div className="bg-white/90 dark:bg-black/80 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                            Élő GPS tracking hamarosan...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
