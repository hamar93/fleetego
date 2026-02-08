import React, { useState } from 'react';
import api from '../../api/api';

const DriverDetailsModal = ({ driver, onClose, onSave }) => {
    // Determine initial documents list
    const [documents, setDocuments] = useState(driver.documents || []);

    // New document form state
    const [newDoc, setNewDoc] = useState({
        type: 'license',
        number: '',
        expiry_date: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddDocument = () => {
        if (!newDoc.number || !newDoc.expiry_date) return;

        const docToAdd = {
            ...newDoc,
            created_at: new Date().toISOString()
        };

        setDocuments([...documents, docToAdd]);
        setNewDoc({ type: 'license', number: '', expiry_date: '' }); // Reset form
    };

    const handleRemoveDocument = (index) => {
        const updated = [...documents];
        updated.splice(index, 1);
        setDocuments(updated);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            // Save documents to backend
            await api.put(`/api/fleet/drivers/${driver.id}/documents`, documents);
            onSave(); // Refresh list
            onClose();
        } catch (err) {
            console.error(err);
            setError("Nem sikerült menteni a változtatásokat.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to check expiry
    const getExpiryStatus = (dateStr) => {
        const expiry = new Date(dateStr);
        const now = new Date();
        const warningDate = new Date();
        warningDate.setDate(now.getDate() + 30); // 30 days warning

        if (expiry < now) return { color: 'text-red-600', text: 'LEJÁRT!', icon: 'fa-exclamation-circle' };
        if (expiry < warningDate) return { color: 'text-orange-500', text: 'Hamarosan lejár', icon: 'fa-exclamation-triangle' };
        return { color: 'text-green-600', text: 'Érvényes', icon: 'fa-check-circle' };
    };

    const docTypeLabels = {
        'license': 'Jogosítvány',
        'gki': 'GKI Kártya',
        'driver_card': 'Gépjárművezetői Kártya',
        'other': 'Egyéb'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Sofőr Adatok: {driver.name}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            <i className="fas fa-id-card mr-2 text-blue-500"></i>Okmányok Kezelése
                        </h3>

                        {/* List */}
                        <div className="space-y-3 mb-6">
                            {documents.length === 0 && (
                                <p className="text-gray-500 italic text-sm">Nincsenek feltöltött okmányok.</p>
                            )}
                            {documents.map((doc, idx) => {
                                const status = getExpiryStatus(doc.expiry_date);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <i className="fas fa-file-alt"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {docTypeLabels[doc.type] || doc.type}
                                                </div>
                                                <div className="text-sm text-gray-500 font-mono">{doc.number}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`text-sm font-medium ${status.color} flex items-center gap-1`}>
                                                <i className={`fas ${status.icon}`}></i>
                                                <span>{doc.expiry_date}</span>
                                            </div>
                                            <button onClick={() => handleRemoveDocument(idx)} className="text-red-400 hover:text-red-600">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add New */}
                        <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 uppercase tracking-wider">Új Okmány Hozzáadása</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Típus</label>
                                    <select
                                        className="w-full p-2 border rounded-md text-sm dark:bg-slate-800 dark:border-slate-600"
                                        value={newDoc.type}
                                        onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                                    >
                                        <option value="license">Jogosítvány</option>
                                        <option value="gki">GKI Kártya</option>
                                        <option value="driver_card">Tachográf Kártya</option>
                                        <option value="other">Egyéb</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Azonosító</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-md text-sm dark:bg-slate-800 dark:border-slate-600"
                                        placeholder="SZ123456"
                                        value={newDoc.number}
                                        onChange={e => setNewDoc({ ...newDoc, number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Lejárat</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded-md text-sm dark:bg-slate-800 dark:border-slate-600"
                                            value={newDoc.expiry_date}
                                            onChange={e => setNewDoc({ ...newDoc, expiry_date: e.target.value })}
                                        />
                                        <button
                                            onClick={handleAddDocument}
                                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                                            disabled={!newDoc.number || !newDoc.expiry_date}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400">
                        Bezárás
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        {loading && <i className="fas fa-spinner fa-spin"></i>}
                        Mentés
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverDetailsModal;
