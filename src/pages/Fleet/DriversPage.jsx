import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import DriverDetailsModal from '../../components/Fleet/DriverDetailsModal';

const DriversPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/fleet/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error("Failed to load drivers", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to count issues
    const getDriverStatus = (driver) => {
        if (!driver.documents || driver.documents.length === 0) {
            return { label: 'Hiányos', color: 'bg-gray-100 text-gray-600' };
        }

        const now = new Date();
        let expired = 0;
        let warning = 0;

        driver.documents.forEach(doc => {
            const exp = new Date(doc.expiry_date);
            const warnDate = new Date();
            warnDate.setDate(now.getDate() + 30);

            if (exp < now) expired++;
            else if (exp < warnDate) warning++;
        });

        if (expired > 0) return { label: `${expired} Lejárt Okmány`, color: 'bg-red-100 text-red-800' };
        if (warning > 0) return { label: `${warning} Hamarosan Lejár`, color: 'bg-orange-100 text-orange-800' };

        return { label: 'Rendben', color: 'bg-green-100 text-green-800' };
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sofőrök Kezelése</h1>
                    <p className="text-sm text-gray-500">Munkatársak, okmányok és jogosultságok</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <i className="fas fa-user-plus"></i>
                    Új Sofőr Meghívása
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Sofőrök betöltése...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drivers.map(driver => {
                        const status = getDriverStatus(driver);
                        return (
                            <div key={driver.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg font-bold">
                                            {driver.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{driver.name}</h3>
                                            <p className="text-sm text-gray-500">{driver.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Telefon:</span>
                                        <span className="text-gray-900 dark:text-gray-300">{driver.phone || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Feltöltött Okmányok:</span>
                                        <span className="text-gray-900 dark:text-gray-300 font-medium">{driver.documents?.length || 0} db</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedDriver(driver)}
                                    className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-edit"></i>
                                    Adatok & Okmányok
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedDriver && (
                <DriverDetailsModal
                    driver={selectedDriver}
                    onClose={() => setSelectedDriver(null)}
                    onSave={loadDrivers}
                />
            )}
        </div>
    );
};

export default DriversPage;
