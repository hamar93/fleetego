import React, { useState, useEffect, useRef } from 'react';
import { timocomService } from '../services/timocom';
import FreightDetailsModal from '../components/Timocom/FreightDetailsModal';

const LiveFreightWatcher = () => {
    const [freights, setFreights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [selectedFreight, setSelectedFreight] = useState(null);
    const [sandboxMode, setSandboxMode] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Search filters state
    const [searchFilters, setSearchFilters] = useState({
        originCountry: 'HU',
        originCity: '',
        destinationCountry: 'DE',
        destinationCity: '',
        date: ''
    });

    // No auto-refresh - only manual search
    const loadFreights = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
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

            setFreights(data || []);
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
        try {
            // Prepare offer payload
            const offerPayload = {
                timocom_id: id,
                offered_price: parseFloat(price),
                currency: "EUR", // Default for now, could be dynamic
                message: `Offer for ${id}`
            };

            const response = await timocomService.sendOffer(offerPayload);

            if (response.status === 'success') {
                alert(`Ajánlat SIKERESEN elküldve!\n\nID: ${id}\nÁr: ${price} EUR\nStátusz: ${response.offer.status}`);
            } else {
                alert('Hiba történt az ajánlat küldésekor.');
            }
            setSelectedFreight(null);
        } catch (error) {
            console.error("Offer sending failed:", error);
            alert('Hiba történt a kommunikációban. Kérjük próbálja újra.');
        }
    };

    const filteredFreights = freights.filter(f => {
        if (!filter) return true;
        const q = filter.toLowerCase();
        return (
            (f.description && f.description.toLowerCase().includes(q)) ||
            (f.origin?.city && f.origin.city.toLowerCase().includes(q)) ||
            (f.destination?.city && f.destination.city.toLowerCase().includes(q)) ||
            (f.cargo?.load_type && f.cargo.load_type.toLowerCase().includes(q)) ||
            (f.company?.name && f.company.name.toLowerCase().includes(q))
        );
    });

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
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
                                <option value="NL">🇳🇱 NL</option>
                                <option value="BE">🇧🇪 BE</option>
                                <option value="ES">🇪🇸 ES</option>
                                <option value="HR">🇭🇷 HR</option>
                                <option value="SI">🇸🇮 SI</option>
                                <option value="BG">🇧🇬 BG</option>
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
                                <option value="NL">🇳🇱 NL</option>
                                <option value="BE">🇧🇪 BE</option>
                                <option value="ES">🇪🇸 ES</option>
                                <option value="HR">🇭🇷 HR</option>
                                <option value="SI">🇸🇮 SI</option>
                                <option value="BG">🇧🇬 BG</option>
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
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Keresés...</>
                            ) : (
                                <><i className="fas fa-search"></i> Keresés</>
                            )}
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
                        {[
                            { from: 'HU', to: 'DE' },
                            { from: 'HU', to: 'AT' },
                            { from: 'HU', to: 'IT' },
                            { from: 'DE', to: 'HU' },
                            { from: 'AT', to: 'HU' },
                            { from: 'HU', to: 'RO' },
                        ].map(({ from, to }) => (
                            <button
                                key={`${from}-${to}`}
                                onClick={() => setSearchFilters({ ...searchFilters, originCountry: from, destinationCountry: to, originCity: '', destinationCity: '' })}
                                className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                            >
                                {from} → {to}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Találatok ({filteredFreights.length})
                </h2>
                {freights.length > 0 && (
                    <input
                        type="text"
                        placeholder="Szűrés eredményeken..."
                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Fuvarok betöltése a Timocom-ból...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && hasSearched && freights.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <i className="fas fa-truck text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p className="text-gray-500">Nincs találat a megadott feltételekre.</p>
                    <p className="text-sm text-gray-400 mt-1">Próbáljon más országot vagy várost megadni.</p>
                </div>
            )}

            {/* Initial State */}
            {!loading && !hasSearched && (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <i className="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p className="text-gray-500">Állítsa be a keresési feltételeket és kattintson a "Keresés" gombra.</p>
                </div>
            )}

            {/* Results Grid */}
            {!loading && filteredFreights.length > 0 && (
                <div className="grid gap-4">
                    {filteredFreights.map(freight => (
                        <div key={freight.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {/* Route Header */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold px-3 py-1 rounded-lg">
                                            {freight.origin?.city || '?'} ({freight.origin?.country}) → {freight.destination?.city || '?'} ({freight.destination?.country})
                                        </span>
                                        {freight.cargo?.load_type && freight.cargo.load_type !== 'N/A' && (
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${freight.cargo.load_type === 'FTL' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'}`}>
                                                {freight.cargo.load_type}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {freight.cargo?.description && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{freight.cargo.description}</p>
                                    )}

                                    {/* Details Row */}
                                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                                        {freight.cargo?.weight && (
                                            <div className="flex items-center gap-1">
                                                <i className="fas fa-weight-hanging"></i>
                                                <span>{freight.cargo.weight}</span>
                                            </div>
                                        )}
                                        {freight.cargo?.length && (
                                            <div className="flex items-center gap-1">
                                                <i className="fas fa-ruler-horizontal"></i>
                                                <span>{freight.cargo.length}</span>
                                            </div>
                                        )}
                                        {freight.distance && (
                                            <div className="flex items-center gap-1">
                                                <i className="fas fa-road"></i>
                                                <span>{freight.distance} km</span>
                                            </div>
                                        )}
                                        {freight.pickup_date && (
                                            <div className="flex items-center gap-1">
                                                <i className="fas fa-calendar-alt"></i>
                                                <span>Felrakás: {freight.pickup_date}</span>
                                            </div>
                                        )}
                                        {freight.pickup_time && (
                                            <div className="flex items-center gap-1">
                                                <i className="fas fa-clock"></i>
                                                <span>{freight.pickup_time}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vehicle & Company Row */}
                                    <div className="flex gap-3 mt-2 flex-wrap">
                                        {freight.vehicle?.body?.length > 0 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {freight.vehicle.body.map((b, i) => (
                                                    <span key={i} className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-400">{b}</span>
                                                ))}
                                            </div>
                                        )}
                                        {freight.company?.name && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <i className="fas fa-building"></i> {freight.company.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="text-right min-w-[150px] ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {freight.price?.amount ? `${freight.price.amount} ${freight.price.currency}` : 'Ár nélkül'}
                                    </div>
                                    <button
                                        onClick={() => handleOpenOffer(freight)}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-eye"></i>
                                        Megtekintés
                                    </button>
                                    <div className="text-xs text-center text-gray-400 mt-1">
                                        Részletes infó &amp; Ajánlat
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
