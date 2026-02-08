
import React, { useState, useEffect } from 'react';
import { timocomService } from '../../services/timocom';
import { interpretFreight } from '../../utils/aiFreightInterpreter';

const LiveFreightWatcher = () => {
    const [freights, setFreights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        loadFreights();
        // Simulate live updates every 30 seconds
        const interval = setInterval(loadFreights, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadFreights = async () => {
        setLoading(true);
        try {
            const data = await timocomService.getFreights();
            // Enhance data with AI interpretation
            const enhancedData = data.map(item => ({
                ...item,
                ai: interpretFreight(item.description)
            }));
            setFreights(enhancedData);
        } catch (error) {
            console.error("Failed to load freights", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOffer = async (id, price) => {
        alert(`Ajánlat elküldve: ${id} - ${price} EUR (Demo)`);
        // In real app: await timocomService.sendOffer(id, price);
    };

    const filteredFreights = freights.filter(f =>
        f.description.toLowerCase().includes(filter.toLowerCase()) ||
        f.ai.pickup?.toLowerCase().includes(filter.toLowerCase()) ||
        f.ai.delivery?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Live Freight Watcher</h1>
                    <p className="text-sm text-gray-500">Valós idejű fuvarpiac (Timocom Stream)</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Szűrés (pl. HU, 24t)..."
                        className="px-4 py-2 border rounded-lg"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <button onClick={loadFreights} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i className="fas fa-sync-alt mr-2"></i> Frissítés
                    </button>
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
                                        {freight.price} €
                                    </div>
                                    <button
                                        onClick={() => handleOffer(freight.id, freight.price)}
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                        Azonnali Ajánlat
                                    </button>
                                    <div className="text-xs text-center text-gray-400 mt-1">
                                        1 kattintás = Elküldve
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveFreightWatcher;
