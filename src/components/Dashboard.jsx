import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mock freight data (ez jönne majd az űrlapról vagy TIMOCOM-ból)
    const [freightData, setFreightData] = useState({
        origin: "Budapest, HU",
        destination: "Munich, DE",
        price: 850,
        distance_km: 680,
        cargo_type: "General Cargo",
        weight_kg: 24000
    });

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const response = await api.post('/ai/analyze', {
                freight_data: freightData
            });
            setAnalysisResult(response.data);
        } catch (err) {
            console.error("AI Error:", err);
            setError(err.response?.data?.detail || "Hiba történt az elemzés során.");
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.title')}</h1>
                <div className="space-x-2">
                    <button onClick={() => changeLanguage('hu')} className="px-3 py-1 bg-white rounded shadow text-sm font-semibold hover:bg-gray-50">HU</button>
                    <button onClick={() => changeLanguage('de')} className="px-3 py-1 bg-white rounded shadow text-sm font-semibold hover:bg-gray-50">DE</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bal oldal: Fuvar Adatok */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Aktuális Fuvar (Mock)</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('freight.origin')}:</span>
                            <span className="font-medium">{freightData.origin}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('freight.destination')}:</span>
                            <span className="font-medium">{freightData.destination}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('freight.price')}:</span>
                            <span className="font-medium">{freightData.price} EUR</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('status.analyzing')}
                            </span>
                        ) : (
                            t('freight.analyze')
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                </div>

                {/* Jobb oldal: AI Eredmény */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">FleetEgo Agent (AI)</h2>

                    {!analysisResult ? (
                        <div className="text-gray-400 italic text-center py-10">
                            Kattints az elemzésre az eredményhez...
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('result.recommendation')}:</span>
                                <span className={`px-4 py-1 rounded-full text-white font-bold text-sm ${analysisResult.recommendation === 'ACCEPT' ? 'bg-green-500' :
                                        analysisResult.recommendation === 'REJECT' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}>
                                    {analysisResult.recommendation}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('result.confidence')}:</span>
                                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${(analysisResult.confidence || 0) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-mono">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                            </div>

                            <div className="mt-4">
                                <span className="text-gray-600 block mb-1">{t('result.reasoning')}:</span>
                                <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-100 text-sm leading-relaxed">
                                    {analysisResult.reasoning}
                                </p>
                            </div>

                            {analysisResult.metadata && (
                                <div className="mt-6 pt-4 border-t text-xs text-gray-400">
                                    Token usage: {JSON.stringify(analysisResult.metadata)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
