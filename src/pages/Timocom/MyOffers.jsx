import React, { useState, useEffect } from 'react';
import { timocomService } from '../../services/timocom';

const MyOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        setLoading(true);
        try {
            const data = await timocomService.getMyOffers();
            setOffers(data);
        } catch (error) {
            console.error("Képtelen betölteni az ajánlatokat:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2.5 py-1 rounded border border-orange-200 dark:border-orange-800"><i className="fas fa-clock mr-1"></i> Függőben</span>;
            case 'ACCEPTED':
                return <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded border border-green-200 dark:border-green-800"><i className="fas fa-check-circle mr-1"></i> Elfogadva</span>;
            case 'REJECTED':
                return <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded border border-red-200 dark:border-red-800"><i className="fas fa-times-circle mr-1"></i> Elutasítva</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded border border-gray-200 dark:border-slate-600">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('hu-HU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <i className="fas fa-gavel text-blue-600"></i>
                        Ajánlataim (Timocom)
                    </h1>
                    <p className="text-sm text-gray-500">Az idei év során elküldött összes fuvarlicit</p>
                </div>
                <button
                    onClick={loadOffers}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                    title="Frissítés"
                >
                    <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Timocom ID</th>
                                <th className="px-6 py-4 font-semibold">Küldve</th>
                                <th className="px-6 py-4 font-semibold">Ajánlati Ár</th>
                                <th className="px-6 py-4 font-semibold">Státusz</th>
                                <th className="px-6 py-4 font-semibold text-right">Művelet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <i className="fas fa-circle-notch fa-spin text-2xl mb-2 text-blue-500"></i>
                                        <p>Ajánlatok betöltése...</p>
                                    </td>
                                </tr>
                            ) : offers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="bg-gray-50 dark:bg-slate-900/50 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                                            <i className="fas fa-folder-open text-2xl text-gray-400"></i>
                                        </div>
                                        <p className="text-base font-medium text-gray-900 dark:text-white mb-1">Még nincsenek elküldött ajánlatok</p>
                                        <p className="text-sm">Térjen át az Élő Kereső modulra és küldjön egy ajánlatot.</p>
                                    </td>
                                </tr>
                            ) : (
                                offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {offer.timocom_id}
                                            </div>
                                            {offer.message && (
                                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs" title={offer.message}>
                                                    <i className="far fa-comment-dots mr-1"></i>
                                                    {offer.message}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatDate(offer.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900 dark:text-white">
                                                {offer.offered_price} {offer.currency}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(offer.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Részletek
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyOffers;
