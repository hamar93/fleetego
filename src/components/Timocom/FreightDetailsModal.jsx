
import React, { useState } from 'react';

const FreightDetailsModal = ({ freight, onClose, onSendOffer }) => {
    const [offerPrice, setOfferPrice] = useState(freight.price || freight.ai.priceHint || 0);

    if (!freight) return null;

    const { ai } = freight;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {freight.id}
                            </span>
                            {ai.riskFactor === 'Medium' && (
                                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                    Risk: Medium
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold leading-tight">
                            {ai.pickup} <i className="fas fa-arrow-right mx-2 text-gray-400"></i> {ai.delivery}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Partner Info - TRUST BUILDER */}
                    {ai.partner && (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                                {ai.partner.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    {ai.partner.name}
                                    {ai.partner.verified && <i className="fas fa-check-circle text-blue-600" title="Verified Partner"></i>}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <i className="fas fa-star text-yellow-400"></i>
                                    <span>{ai.partner.rating} / 5.0</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rakomány</h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <i className="fas fa-weight-hanging w-6 text-center text-gray-400"></i>
                                    <span className="font-medium">{ai.weight} tonna</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <i className="fas fa-box w-6 text-center text-gray-400"></i>
                                    <span>{ai.pallets} paletta</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <i className="fas fa-truck w-6 text-center text-gray-400"></i>
                                    <span>{ai.equipment.join(', ') || 'Nincs specifikáció'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Időpontok</h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <i className="fas fa-clock w-6 text-center text-gray-400"></i>
                                    <span>Fel: {ai.times?.loading || 'Azonnal'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <i className="fas fa-flag-checkered w-6 text-center text-gray-400"></i>
                                    <span>Le: {ai.times?.unloading || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Eredeti kiírás</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic border border-gray-100">
                            "{freight.description}"
                        </p>
                    </div>

                    {/* Price & Action */}
                    <div className="border-t pt-6 flex items-center justify-between">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ajánlati ár (EUR)</label>
                            <input
                                type="number"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(Number(e.target.value))}
                                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 focus:outline-none w-32"
                            />
                        </div>
                        <button
                            onClick={() => onSendOffer(freight.id, offerPrice)}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-transform active:scale-95 shadow-lg shadow-green-600/20 flex items-center gap-2"
                        >
                            <i className="fas fa-paper-plane"></i>
                            Ajánlat Küldése
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreightDetailsModal;
