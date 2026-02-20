import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { timocomService } from '../../services/timocom';

const FreightDetailsModal = ({ freight, onClose, onSendOffer }) => {
    const [offerPrice, setOfferPrice] = useState(freight?.price?.amount || 0);
    const [aiPrediction, setAiPrediction] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [message, setMessage] = useState('');
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [riskScore, setRiskScore] = useState(null);
    const [loadingRisk, setLoadingRisk] = useState(false);

    useEffect(() => {
        if (freight) {
            setOfferPrice(freight.price?.amount || 0);
            fetchPrediction();
            fetchTemplates();
            if (freight.company?.name) {
                fetchRisk(freight.company.name);
            }
        }
    }, [freight]);

    const fetchRisk = async (companyName) => {
        setLoadingRisk(true);
        try {
            const data = await timocomService.analyzeRisk(companyName);
            setRiskScore(data);
        } catch (error) {
            console.error("Failed to fetch risk score:", error);
        } finally {
            setLoadingRisk(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const data = await timocomService.getTemplates();
            setTemplates(data || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        }
    };

    const handleSaveAsTemplate = async () => {
        if (!message.trim()) return;

        const templateName = prompt("Add meg a sablon nevét (pl.: 'Két sofőr', 'Azonnal'):");
        if (!templateName) return;

        setSavingTemplate(true);
        try {
            const newTemplate = await timocomService.saveTemplate({
                name: templateName,
                content: message,
            });
            setTemplates([...templates, newTemplate]);
            alert("Sablon sikeresen elmentve!");
        } catch (error) {
            alert("Hiba a sablon mentésekor.");
        } finally {
            setSavingTemplate(false);
        }
    };

    const fetchPrediction = async () => {
        setLoadingAi(true);
        try {
            // Ensure distance is a valid number, even if it comes as a string like "1,200"
            let distVal = 500;
            if (freight.distance) {
                const cleanDist = String(freight.distance).replace(/[^0-9.]/g, '');
                if (cleanDist) distVal = parseFloat(cleanDist);
            }

            const vehicleType = freight.cargo?.load_type === 'LTL' ? 'van' : 'semi_trailer_tautliner';

            const req = {
                distance_km: distVal,
                vehicle_type: vehicleType,
                company_id: 'default_company', // will be injected by backend from currentUser usually, but lets provide fallback
                origin: freight.origin?.city,
                destination: freight.destination?.city,
                weight_t: freight.cargo?.weight ? parseFloat(String(freight.cargo.weight).replace(/[^0-9.]/g, '')) : 10.0
            };

            const res = await api.post('/ai/predict-price', req); // Note: correct prefix is /ai, not /api/ai
            setAiPrediction(res.data);

            // Auto-fill offer price if it was originally 0 or missing
            if (!freight.price?.amount || freight.price.amount === 0) {
                setOfferPrice(res.data.predicted_price);
            }
        } catch (error) {
            console.error("AI Prediction failed:", error);
        } finally {
            setLoadingAi(false);
        }
    };

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
                    {/* Company Info & Partner Risk Score */}
                    {freight.company?.name && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Company Details */}
                            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
                                <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-xl flex-shrink-0">
                                    {freight.company.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {freight.company.name}
                                    </h3>
                                    {freight.contact?.name && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <i className="fas fa-user mr-1 w-4"></i> {freight.contact.name}
                                        </p>
                                    )}
                                    {freight.contact?.phone && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <i className="fas fa-phone mr-1 w-4"></i> {freight.contact.phone}
                                        </p>
                                    )}
                                    {freight.contact?.email && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <i className="fas fa-envelope mr-1 w-4"></i> {freight.contact.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Partner Risk Score Widget */}
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm relative overflow-hidden">
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i className="fas fa-shield-alt text-blue-500"></i> Partner Kockázatelemzés
                                </h4>

                                {loadingRisk ? (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                                        <i className="fas fa-circle-notch fa-spin text-blue-500"></i> Cégadatbázis lekérdezése...
                                    </div>
                                ) : riskScore ? (
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-inner ${riskScore.grade === 'A' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                                    riskScore.grade === 'B' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                                                        riskScore.grade === 'C' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                            'bg-gradient-to-br from-red-500 to-red-700'
                                                    }`}>
                                                    <span className="text-lg leading-none">{riskScore.grade}</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        Kockázati Besorolás
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Index: {riskScore.score}/100
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            <i className="fas fa-money-bill-wave mr-1 text-green-600 dark:text-green-400"></i>
                                            {riskScore.payment_trend}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-auto">
                                            {riskScore.flags.map((flag, i) => (
                                                <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${flag.includes('Új cég') || flag.includes('Végrehajtás') || flag.includes('késedelmek') || flag.includes('csúszások')
                                                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                                    : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                    }`}>
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Background gradient for grade */}
                                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${riskScore.grade === 'A' || riskScore.grade === 'B' ? 'bg-green-500' :
                                            riskScore.grade === 'C' ? 'bg-orange-500' : 'bg-red-500'
                                            }`}></div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 mt-4">Nem sikerült lekérdezni a cégadatokat.</div>
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

                    {/* AI Price Predictor Section */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <i className="fas fa-robot text-purple-500"></i> AI Árbecslő
                        </h4>
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700/80 rounded-xl p-4 border border-purple-100 dark:border-slate-600 shadow-sm relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                            {loadingAi ? (
                                <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-medium">
                                    <i className="fas fa-circle-notch fa-spin text-xl"></i>
                                    Piaci adatok és önköltség elemzése...
                                </div>
                            ) : aiPrediction ? (
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {aiPrediction.predicted_price} {aiPrediction.currency}
                                            </span>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">
                                                Javasolt Licit
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1" title="Algoritmus bizonyossága a számításban">
                                                <i className="fas fa-bullseye text-blue-500"></i>
                                                Konfidencia: {aiPrediction.confidence_score}%
                                            </span>
                                            {aiPrediction.margin_status && (
                                                <span className={`flex items-center gap-1 ${aiPrediction.margin_status.analysis.margin_percent > 10 ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                                                    <i className="fas fa-chart-pie"></i>
                                                    Várható Marzs: {aiPrediction.margin_status.analysis.margin_percent}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Piaci Trend</div>
                                            <div className={`text-sm font-bold flex items-center justify-end gap-1 ${aiPrediction.market_trend === 'UP' ? 'text-green-600' :
                                                aiPrediction.market_trend === 'DOWN' ? 'text-red-500' :
                                                    'text-blue-500'
                                                }`}>
                                                {aiPrediction.market_trend === 'UP' && <><i className="fas fa-arrow-trend-up"></i> Kereslet Nő</>}
                                                {aiPrediction.market_trend === 'DOWN' && <><i className="fas fa-arrow-trend-down"></i> Túlkínálat</>}
                                                {aiPrediction.market_trend === 'STABLE' && <><i className="fas fa-minus"></i> Stabil</>}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setOfferPrice(aiPrediction.predicted_price)}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all shadow-md active:scale-95"
                                        >
                                            <i className="fas fa-magic mr-2"></i>Alkalmaz
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <i className="fas fa-exclamation-triangle text-orange-400"></i>
                                    Az AI becslés nem érhető el.
                                </div>
                            )}
                        </div>
                    </div>

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

                    {/* Message & Templates Section */}
                    <div className="mb-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Üzenet (Opcionális)
                            </h4>
                            {templates.length > 0 && (
                                <span className="text-xs text-blue-500 font-medium">
                                    <i className="fas fa-magic mr-1"></i>Sablonok
                                </span>
                            )}
                        </div>

                        {/* Template Chips */}
                        {templates.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {templates.map(tmpl => (
                                    <button
                                        key={tmpl.id}
                                        onClick={() => setMessage(tmpl.content)}
                                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full transition-colors border border-blue-200 dark:border-blue-800"
                                        title={tmpl.content}
                                    >
                                        {tmpl.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Írja meg fuvarajánlatát a megbízónak... (pl: mikor tud kiállni, egyéb feltételek)"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]"
                            />
                            {message.trim() && (
                                <button
                                    onClick={handleSaveAsTemplate}
                                    disabled={savingTemplate}
                                    className="absolute bottom-3 right-3 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-600 dark:text-gray-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                >
                                    <i className={savingTemplate ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
                                    Mentés sablonként
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="border-t border-gray-200 dark:border-slate-600 pt-6 flex items-center justify-between">
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
                            onClick={() => onSendOffer(freight.id, offerPrice, message)}
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
