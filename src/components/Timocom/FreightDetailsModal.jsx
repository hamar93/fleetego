
import React, { useState } from 'react';

const FreightDetailsModal = ({ freight, onClose, onSendOffer }) => {
    const [offerPrice, setOfferPrice] = useState(freight?.price?.amount || 0);

    if (!freight) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {freight.id?.substring(0, 12)}...
                            </span>
                            {freight.cargo?.load_type && freight.cargo.load_type !== 'N/A' && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${freight.cargo.load_type === 'FTL' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                    {freight.cargo.load_type}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold leading-tight">
                            {freight.origin?.city || '?'} ({freight.origin?.country})
                            <i className="fas fa-arrow-right mx-2 text-gray-400"></i>
                            {freight.destination?.city || '?'} ({freight.destination?.country})
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Company Info */}
                    {freight.company?.name && (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
                            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-xl">
                                {freight.company.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {freight.company.name}
                                </h3>
                                {freight.contact?.name && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <i className="fas fa-user mr-1"></i> {freight.contact.name}
                                    </p>
                                )}
                                {freight.contact?.phone && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <i className="fas fa-phone mr-1"></i> {freight.contact.phone}
                                    </p>
                                )}
                                {freight.contact?.email && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <i className="fas fa-envelope mr-1"></i> {freight.contact.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Cargo Info */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Rakomány</h4>
                            <div className="flex flex-col gap-2">
                                {freight.cargo?.weight && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-weight-hanging w-6 text-center text-gray-400"></i>
                                        <span className="font-medium">{freight.cargo.weight}</span>
                                    </div>
                                )}
                                {freight.cargo?.length && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-ruler-horizontal w-6 text-center text-gray-400"></i>
                                        <span>{freight.cargo.length}</span>
                                    </div>
                                )}
                                {freight.cargo?.load_type && freight.cargo.load_type !== 'N/A' && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-truck w-6 text-center text-gray-400"></i>
                                        <span>{freight.cargo.load_type === 'FTL' ? 'Teljes rakomány (FTL)' : 'Részrakomány (LTL)'}</span>
                                    </div>
                                )}
                                {freight.vehicle?.body?.length > 0 && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-truck-moving w-6 text-center text-gray-400"></i>
                                        <span>{freight.vehicle.body.join(', ')}</span>
                                    </div>
                                )}
                                {freight.vehicle?.equipment?.length > 0 && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-tools w-6 text-center text-gray-400"></i>
                                        <span>{freight.vehicle.equipment.join(', ')}</span>
                                    </div>
                                )}
                                {(!freight.cargo?.weight && !freight.cargo?.length) && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <i className="fas fa-info-circle w-6 text-center"></i>
                                        <span>Nincs részletes rakomány adat</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates & Times */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Időpontok</h4>
                            <div className="flex flex-col gap-2">
                                {freight.pickup_date && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-calendar-alt w-6 text-center text-gray-400"></i>
                                        <span>Felrakás: {freight.pickup_date}</span>
                                    </div>
                                )}
                                {freight.pickup_time && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-clock w-6 text-center text-gray-400"></i>
                                        <span>Idő: {freight.pickup_time}</span>
                                    </div>
                                )}
                                {freight.delivery_date && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-flag-checkered w-6 text-center text-gray-400"></i>
                                        <span>Lerakás: {freight.delivery_date}</span>
                                    </div>
                                )}
                                {freight.delivery_time && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-clock w-6 text-center text-gray-400"></i>
                                        <span>Idő: {freight.delivery_time}</span>
                                    </div>
                                )}
                                {freight.distance && (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <i className="fas fa-road w-6 text-center text-gray-400"></i>
                                        <span>Távolság: {freight.distance} km</span>
                                    </div>
                                )}
                                {(!freight.pickup_date && !freight.pickup_time) && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <i className="fas fa-info-circle w-6 text-center"></i>
                                        <span>Nincs részletes időpont info</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {freight.cargo?.additional_info?.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">További információk</h4>
                            <div className="flex gap-2 flex-wrap">
                                {freight.cargo.additional_info.map((info, i) => (
                                    <span key={i} className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-xs">
                                        {info}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {freight.original_description && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Leírás</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-100 dark:border-slate-600">
                                {freight.original_description}
                            </p>
                        </div>
                    )}

                    {/* Deeplink */}
                    {freight.deeplink && (
                        <div className="mb-6">
                            <a
                                href={freight.deeplink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-2"
                            >
                                <i className="fas fa-external-link-alt"></i>
                                Megnyitás a Timocom-ban
                            </a>
                        </div>
                    )}

                    {/* Price & Action */}
                    <div className="border-t dark:border-slate-600 pt-6 flex items-center justify-between">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ajánlati ár (EUR)</label>
                            <input
                                type="number"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(Number(e.target.value))}
                                className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-600 focus:outline-none w-32"
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
