import React, { useState, useEffect } from 'react';
import { timocomService } from '../services/timocom';
import { interpretFreight } from '../utils/aiFreightInterpreter';
import FreightDetailsModal from '../components/Timocom/FreightDetailsModal';

const LiveFreightWatcher = () => {
    const [freights, setFreights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedFreight, setSelectedFreight] = useState(null);
    const [sandboxMode, setSandboxMode] = useState(false);

    // Search filters state
    const [searchFilters, setSearchFilters] = useState({
        originCountry: 'HU',
        originCity: '',
        destinationCountry: 'DE',
        destinationCity: '',
        date: ''
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        loadFreights();
        // Simulate live updates every 30 seconds
        const interval = setInterval(loadFreights, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadFreights = async () => {
        setLoading(true);
        try {
            // Build filter object from search state
            const filters = {
                originCountry: searchFilters.originCountry,
                originCity: searchFilters.originCity,
                destinationCountry: searchFilters.destinationCountry,
                destinationCity: searchFilters.destinationCity,
                date: searchFilters.date
            };

            const responseData = await timocomService.getFreights(filters);

            let data = [];
            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (responseData && responseData.results) {
                data = responseData.results;
                if (responseData.source === 'TIMOCOM-MOCK') {
                    setSandboxMode(true);
                }
            }

            // Enhance data with AI interpretation
            const enhancedData = (data || [])
                .filter(item => item && (item.description || item.original_description))
                .map(item => ({
                    ...item,
                    // Backend mock returns 'description' which is already formatted properly
                    ai: interpretFreight(item.description || item.original_description)
                }));
            setFreights(enhancedData);
        } catch (error) {
            console.error("Failed to load freights", error);
            setFreights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenOffer = (freight) => {
        setSelectedFreight(freight);
    };

    const handleSendOffer = async (id, price) => {
        // In real app: await timocomService.sendOffer(id, price);
        console.log(`Offer sent: ${id}, ${price}`);
        // Keep simple alert for now as we don't have a Toast context in scope yet
        alert(`Ajánlat SIKERESEN elküldve!\n\nID: ${id}\nÁr: ${price} EUR`);
        setSelectedFreight(null);
    };

    const filteredFreights = freights.filter(f =>
        (f.description && f.description.toLowerCase().includes(filter.toLowerCase())) ||
        (f.ai?.pickup && f.ai.pickup.toLowerCase().includes(filter.toLowerCase())) ||
        (f.ai?.delivery && f.ai.delivery.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        Live Freight Watcher
                        {sandboxMode && (
                            <span className="ml-3 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-400">
                                <i className="fas fa-robot mr-1"></i> AI Szimuláció
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-500">Valós idejű fuvarpiac (Timocom Stream)</p>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Origin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-paper-plane mr-2"></i>Honnan
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={searchFilters.originCountry}
                                onChange={(e) => setSearchFilters({ ...searchFilters, originCountry: e.target.value })}
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-24"
                            >
                                <option value="HU">🇭🇺 HU</option>
                                <option value="DE">🇩🇪 DE</option>
                                <option value="AT">🇦🇹 AT</option>
                                <option value="PL">🇵🇱 PL</option>
                                <option value="SK">🇸🇰 SK</option>
                                <option value="RO">🇷🇴 RO</option>
                                <option value="IT">🇮🇹 IT</option>
                                <option value="CZ">🇨🇿 CZ</option>
                                <option value="FR">🇫🇷 FR</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Város vagy irányítószám (opcionális)"
                                value={searchFilters.originCity}
                                onChange={(e) => setSearchFilters({ ...searchFilters, originCity: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-map-marker-alt mr-2"></i>Hova
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={searchFilters.destinationCountry}
                                onChange={(e) => setSearchFilters({ ...searchFilters, destinationCountry: e.target.value })}
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-24"
                            >
                                <option value="HU">🇭🇺 HU</option>
                                <option value="DE">🇩🇪 DE</option>
                                <option value="AT">🇦🇹 AT</option>
                                <option value="PL">🇵🇱 PL</option>
                                <option value="SK">🇸🇰 SK</option>
                                <option value="RO">🇷🇴 RO</option>
                                <option value="IT">🇮🇹 IT</option>
                                <option value="CZ">🇨🇿 CZ</option>
                                <option value="FR">🇫🇷 FR</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Város vagy irányítószám (opcionális)"
                                value={searchFilters.destinationCity}
                                onChange={(e) => setSearchFilters({ ...searchFilters, destinationCity: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Date and Actions */}
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-calendar mr-2"></i>Rakodási dátum (opcionális)
                        </label>
                        <input
                            type="date"
                            value={searchFilters.date}
                            onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={loadFreights}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <i className={`fas fa-search ${loading ? 'fa-spin fa-spinner' : ''}`}></i>
                            {loading ? 'Keresés...' : 'Keresés'}
                        </button>

                        <button
                            onClick={() => setSearchFilters({
                                originCountry: 'HU',
                                originCity: '',
                                destinationCountry: 'DE',
                                destinationCity: '',
                                date: ''
                            })}
                            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            <i className="fas fa-times mr-2"></i>Törlés
                        </button>
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Gyors keresés:</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSearchFilters({ ...searchFilters, originCountry: 'HU', destinationCountry: 'DE', originCity: '', destinationCity: '' })}
                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            🇭🇺 HU → 🇩🇪 DE
                        </button>
                        <button
                            onClick={() => setSearchFilters({ ...searchFilters, originCountry: 'HU', destinationCountry: 'AT', originCity: '', destinationCity: '' })}
                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            🇭🇺 HU → 🇦🇹 AT
                        </button>
                        <button
                            onClick={() => setSearchFilters({ ...searchFilters, originCountry: 'HU', destinationCountry: 'IT', originCity: '', destinationCity: '' })}
                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            🇭🇺 HU → 🇮🇹 IT
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Találatok ({filteredFreights.length})
                </h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Szűrés eredményeken..."
                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Fuvarok betöltése...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredFreights.map(freight => (
                        <div key={freight.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {freight.ai.pickup || '?'} → {freight.ai.delivery || '?'}
                                        </span>
                                        <span className="text-gray-500 text-xs">{freight.id}</span>
                                        {freight.ai.riskFactor === 'Medium' && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">Risk: Med</span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">{freight.description}</h3>
                                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-weight-hanging"></i>
                                            <span>{freight.ai.weight ? `${freight.ai.weight}t` : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-box"></i>
                                            <span>{freight.ai.pallets ? `${freight.ai.pallets} pal` : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-road"></i>
                                            <span>{freight.distance} km</span>
                                        </div>
                                        {freight.ai.equipment.length > 0 && (
                                            <div className="flex gap-1">
                                                {freight.ai.equipment.map((eq, i) => (
                                                    <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{eq}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right min-w-[150px]">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {freight.price?.amount || freight.price} {freight.price?.currency || '€'}
                                    </div>
                                    <button
                                        onClick={() => handleOpenOffer(freight)}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-eye"></i>
                                        Megtekintés
                                    </button>
                                    <div className="text-xs text-center text-gray-400 mt-1">
                                        Részletes infó & Ajánlat
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFreight && (
                <FreightDetailsModal
                    freight={selectedFreight}
                    onClose={() => setSelectedFreight(null)}
                    onSendOffer={handleSendOffer}
                />
            )}
        </div>
    );
};

export default LiveFreightWatcher;
