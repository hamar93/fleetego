import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const GlobalDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/documents');
            setDocuments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const downloadDocument = async (docId, filename) => {
        try {
            const response = await api.get(`/api/documents/download/${docId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Letöltési hiba!');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dokumentumtár</h1>
                    <p className="text-gray-500">Az összes fuvarhoz kapcsolódó és egyéb céges dokumentum.</p>
                </div>
                <button
                    onClick={fetchDocuments}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                    🔄 Frissítés
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        Dokumentumok betöltése...
                    </div>
                ) : documents.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="text-4xl mb-4">📂</div>
                        <p className="text-gray-500 text-lg">Még nincs feltöltött dokumentum a rendszerben.</p>
                        <p className="text-gray-400 text-sm">A dokumentumokat a Fuvarok részleteinél töltheted fel.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Fájlnév</th>
                                <th className="px-6 py-4">Típus</th>
                                <th className="px-6 py-4">Fuvar ID</th>
                                <th className="px-6 py-4">Feltöltve</th>
                                <th className="px-6 py-4 text-right">Művelet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {documents.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                📄
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{doc.original_filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 font-mono">
                                        {doc.order_id ? `#ORDER-${doc.order_id.substring(0, 6)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => downloadDocument(doc.id, doc.original_filename)}
                                            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                                        >
                                            ⬇ Letöltés
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GlobalDocuments;
