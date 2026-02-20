import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const InvoicesPage = () => {
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const res = await api.get('/api/invoice');
            setInvoices(res.data);
        } catch (error) {
            console.error("Failed to load invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (invoiceId, filename) => {
        try {
            const res = await api.get(`/api/documents/download/${invoiceId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || `invoice_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download invoice", error);
            alert("Hiba történt a letöltés során.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i className="fas fa-file-invoice-dollar text-blue-500"></i>
                    Számlák (Automatikus Cashflow)
                </h1>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center gap-2" onClick={loadInvoices}>
                    <i className="fas fa-sync-alt"></i> Frissítés
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Számlaszám</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Létrehozva</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fuvar / Partner</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Összeg</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Státusz</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="fas fa-spinner fa-spin text-blue-500"></i>
                                            Betöltés...
                                        </div>
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i className="fas fa-file-invoice text-2xl text-gray-400"></i>
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">Még nincsenek legenerált számlák</p>
                                        <p className="text-sm mt-1">Tölts fel egy POD dokumentumot egy fuvarhoz a számla automatikus generálásához.</p>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                <i className="fas fa-file-pdf text-red-500"></i>
                                                {inv.invoice_number}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(inv.uploaded_at).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {inv.order_number || 'Ismeretlen Fuvar'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {inv.partner_name || 'Ismeretlen Partner'}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                                            {inv.amount || '0 EUR'}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-center">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                Generálva
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-right space-x-2">
                                            <button
                                                onClick={() => handleDownload(inv.id, inv.original_filename)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Letöltés"
                                            >
                                                <i className="fas fa-download"></i>
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

export default InvoicesPage;
