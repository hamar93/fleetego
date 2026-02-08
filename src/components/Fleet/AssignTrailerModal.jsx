import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AssignTrailerModal = ({ vehicle, onClose, onSave }) => {
    const [trailers, setTrailers] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(vehicle.attached_trailer_id || '');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadTrailers();
    }, []);

    const loadTrailers = async () => {
        try {
            // Fetch all vehicles filtering for type=trailer in frontend or backend
            // Backend supports filtering by type
            const response = await api.get('/api/fleet/vehicles?type=trailer');
            setTrailers(response.data);
        } catch (error) {
            console.error("Failed to load trailers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await api.post('/api/fleet/attach-trailer', {
                truck_id: vehicle.id,
                trailer_id: selectedTrailer || null // Send null to detach
            });
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to attach trailer", error);
            alert("Hiba történt a mentés során.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pótkocsi Csatolása</h3>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Vontató: <strong className="text-gray-900 dark:text-white">{vehicle.plate_number}</strong>
                    </p>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Válassz pótkocsit:</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white bg-white"
                                value={selectedTrailer}
                                onChange={(e) => setSelectedTrailer(e.target.value)}
                            >
                                <option value="">-- Nincs pótkocsi (Lecsatolás) --</option>
                                {trailers.map(trailer => (
                                    <option key={trailer.id} value={trailer.id}>
                                        {trailer.plate_number} {trailer.status !== 'idle' && trailer.id !== vehicle.attached_trailer_id ? `(${trailer.status})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                        className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Mégse
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        onClick={handleSubmit}
                        disabled={saving || loading}
                    >
                        {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        Mentés
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTrailerModal;
