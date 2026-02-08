import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const DriverLogs = () => {
    const { t } = useTranslation();
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState(null);
    const [compliance, setCompliance] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [form, setForm] = useState({
        activity: 'drive',
        start_time: '',
        duration_minutes: 0
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    useEffect(() => {
        if (selectedDriver && selectedDate) {
            fetchLogs();
            fetchSummary();
            fetchCompliance();
        }
    }, [selectedDriver, selectedDate]);

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/api/fleet/drivers');
            setDrivers(res.data);
            if (res.data.length > 0) setSelectedDriver(res.data[0].id);
        } catch (error) {
            console.error("Failed to fetch drivers", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get(`/api/driver-logs/${selectedDriver}?date=${selectedDate}`);
            setLogs(res.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await api.get(`/api/driver-logs/summary/${selectedDriver}?date=${selectedDate}`);
            setSummary(res.data);
        } catch (error) {
            setSummary(null);
        }
    };

    const fetchCompliance = async () => {
        try {
            const res = await api.get(`/api/compliance/driver/${selectedDriver}/status`);
            setCompliance(res.data);
        } catch (error) {
            console.error("Failed to fetch compliance", error);
            setCompliance(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Calculate full ISO string for start_time
            const startIso = `${selectedDate}T${form.start_time}:00`;

            await api.post('/api/driver-logs/', {
                driver_id: selectedDriver,
                date: selectedDate,
                activity: form.activity,
                start_time: startIso,
                duration_minutes: parseInt(form.duration_minutes)
            });

            // Refresh
            fetchLogs();
            fetchSummary();
            setForm({ ...form, start_time: '', duration_minutes: 0 });
        } catch (error) {
            alert("Hiba a rögzítéskor");
        } finally {
            setLoading(false);
        }
    };

    const formatMinutes = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⏱️ Vezetési Napló (Béta)</h1>
                <div className="flex gap-4">
                    <select
                        className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                    >
                        <option value="" disabled>Válassz sofőrt...</option>
                        {drivers.length === 0 && <option value="" disabled>Nincs elérhető sofőr</option>}
                        {drivers.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.name} {d.email && d.email !== d.name ? `(${d.email})` : ''}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Card */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Mai Vezetés</div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatMinutes(summary.total_drive)}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                        <div className="text-sm text-green-600 dark:text-green-400 font-semibold">Mai Pihenő</div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatMinutes(summary.total_rest)}</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">Egyéb Munka</div>
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{formatMinutes(summary.total_work)}</div>
                    </div>
                    <div className={`p-4 rounded-xl border ${summary.remaining_drive_daily < 60 ? 'bg-red-50 border-red-200 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-gray-800 border-gray-200'}`}>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Hátralévő Idő (Napi 9h)</div>
                        <div className={`text-2xl font-bold ${summary.remaining_drive_daily < 60 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {formatMinutes(summary.remaining_drive_daily)}
                        </div>
                    </div>
                </div>
            )}

            {/* Compliance Alert Section */}
            {compliance && (
                <div className={`p-4 rounded-xl border ${compliance.status === 'VIOLATION' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900' :
                        compliance.status === 'WARNING' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900' :
                            'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900'
                    }`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${compliance.status === 'VIOLATION' ? 'text-red-800 dark:text-red-300' :
                                    compliance.status === 'WARNING' ? 'text-orange-800 dark:text-orange-300' :
                                        'text-green-800 dark:text-green-300'
                                }`}>
                                {compliance.status === 'VIOLATION' ? '🛑 Szabálysértés (EU561)' :
                                    compliance.status === 'WARNING' ? '⚠️ Figyelmeztetés' :
                                        '✅ Megfelelő (EU561 Compatibility)'}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {compliance.warnings.map((w, idx) => (
                                    <div key={idx} className="text-sm font-medium flex items-center gap-2">
                                        <span>⚠️</span> {w}
                                    </div>
                                ))}
                                {compliance.status === 'OK' && (
                                    <div className="text-sm opacity-80">Minden vezetési és pihenőidő szabály betartva.</div>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Heti Vezetés (Max 56h)</div>
                            <div className="font-bold text-xl text-gray-900 dark:text-white">
                                {Math.floor(compliance.metrics.weekly_drive_minutes / 60)}h {compliance.metrics.weekly_drive_minutes % 60}m / 56h
                            </div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 ml-auto overflow-hidden">
                                <div
                                    className={`h-full ${compliance.metrics.weekly_drive_minutes > 3360 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(100, (compliance.metrics.weekly_drive_minutes / 3360) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Logs & Files */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Activity List */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
                            Tevékenységek Listája
                        </div>
                        <div className="p-0">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">Nincs rögzített adat erre a napra.</div>
                            ) : (
                                <table className="w-full text-left bg-white dark:bg-[#1e293b]">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                                            <th className="px-6 py-3">Kezdés</th>
                                            <th className="px-6 py-3">Tevékenység</th>
                                            <th className="px-6 py-3">Időtartam</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {logs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-200">
                                                    {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium 
                                                        ${log.activity === 'drive' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            log.activity === 'rest' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                                'bg-gray-100 text-gray-600'}`}>
                                                        {log.activity === 'drive' ? 'Vezetés' : log.activity === 'rest' ? 'Pihenő' : 'Egyéb'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-200">
                                                    {log.duration_minutes} perc
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-900 dark:text-white flex justify-between">
                            <span>Tachográf Fájlok (.DDD)</span>
                        </div>
                        <div className="p-6">
                            <TachographUploader driverId={selectedDriver} />
                        </div>
                    </div>

                </div>

                {/* Right Column: Form */}
                <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
                        Új Tevékenység Rögzítése
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* ... form content ... */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tevékenység</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setForm({ ...form, activity: 'drive' })} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${form.activity === 'drive' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Vezetés</button>
                                <button type="button" onClick={() => setForm({ ...form, activity: 'rest' })} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${form.activity === 'rest' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Pihenő</button>
                                <button type="button" onClick={() => setForm({ ...form, activity: 'work' })} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${form.activity === 'work' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Egyéb</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kezdés Időpontja</label>
                            <input
                                type="time"
                                required
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                value={form.start_time}
                                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hossz (perc)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                value={form.duration_minutes}
                                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Mentés...' : 'Hozzáadás'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const TachographUploader = ({ driverId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        if (driverId) loadFiles();
    }, [driverId]);

    const loadFiles = async () => {
        try {
            const res = await api.get(`/api/driver-logs/files/${driverId}`);
            setFiles(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const uploadFile = async (file) => {
        if (!file || !driverId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/api/driver-logs/upload?driver_id=${driverId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            loadFiles();
        } catch (error) {
            alert('Hiba a feltöltés során!');
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (['ddd', 'tgd', 'v1b', 'c1b'].includes(ext)) {
                uploadFile(file);
            } else {
                alert('Csak .DDD, .TGD, .V1B, .C1B fájlok támogatottak!');
            }
        }
    };

    const analyzeFile = async (fileId, filename) => {
        setAnalyzing(true);
        setAnalysisResult(null);
        try {
            const res = await api.post(`/api/driver-logs/analyze/${fileId}`);
            if (res.data.success) {
                setAnalysisResult({
                    filename: res.data.filename,
                    fileSize: res.data.file_size,
                    activities: res.data.activities
                });
            } else {
                alert(`Hiba: ${res.data.error || 'Ismeretlen hiba'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Hiba az elemzés során");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all 
                    ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
                    ${!driverId || uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400'}
                `}
                onClick={() => document.getElementById('ddd-upload-enhanced').click()}
            >
                <input
                    type="file"
                    accept=".ddd,.tgd,.v1b,.c1b"
                    onChange={handleUpload}
                    className="hidden"
                    id="ddd-upload-enhanced"
                    disabled={!driverId || uploading}
                />
                <div className="text-3xl mb-2">{uploading ? '⏳' : '📄'}</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {uploading ? 'Feltöltés folyamatban...' : 'Húzza ide a fájlt, vagy kattintson'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Támogatott: .DDD, .TGD, .V1B, .C1B</div>
            </div>

            {/* Files List */}
            <div className="space-y-2">
                {files.length === 0 ? (
                    <div className="text-sm text-gray-500 italic text-center py-4">Nincs feltöltött fájl.</div>
                ) : (
                    files.map(f => (
                        <div key={f.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">{f.filename}</div>
                                <div className="text-xs text-gray-500">{new Date(f.upload_date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                                    {f.status}
                                </span>
                                <button
                                    onClick={() => analyzeFile(f.id, f.filename)}
                                    disabled={analyzing}
                                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50"
                                >
                                    {analyzing ? '⏳' : '🔍'} Elemzés
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Analysis Results Panel */}
            {analysisResult && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-blue-900 dark:text-blue-100">
                            📊 Elemzési Eredmények
                        </h4>
                        <button
                            onClick={() => setAnalysisResult(null)}
                            className="text-blue-500 hover:text-blue-700 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        <span className="font-medium">{analysisResult.filename}</span> • {analysisResult.fileSize} bájt
                    </div>

                    {analysisResult.activities.length === 0 ? (
                        <div className="text-gray-500 text-sm">Nem található napi rekord a fájlban.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800">
                                        <th className="py-2 pr-4">Dátum</th>
                                        <th className="py-2 pr-4">Távolság</th>
                                        <th className="py-2">Offset</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100 dark:divide-blue-900">
                                    {analysisResult.activities.map((act, idx) => (
                                        <tr key={idx} className="text-blue-900 dark:text-blue-100">
                                            <td className="py-2 pr-4 font-medium">{act.date}</td>
                                            <td className="py-2 pr-4">{act.distance_km} km</td>
                                            <td className="py-2 text-gray-500 text-xs">0x{act.raw_offset?.toString(16)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DriverLogs;
