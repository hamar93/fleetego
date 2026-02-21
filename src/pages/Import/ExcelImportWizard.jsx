import React, { useState } from 'react';
import { TruckIcon, ArrowUpTrayIcon, CheckCircleIcon, ExclamationCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import api from '../../api/api';

const TARGET_FIELDS = [
    { value: '', label: '-- Ignorálás (Nem importáljuk) --' },
    { value: 'pickup_name', label: 'Felrakó Név' },
    { value: 'pickup_zip', label: 'Felrakó Irányítószám' },
    { value: 'pickup_city', label: 'Felrakó Város' },
    { value: 'pickup_address', label: 'Felrakó Cím' },
    { value: 'pickup_date', label: 'Felrakó Ideje' },
    { value: 'delivery_name', label: 'Lerakó Név' },
    { value: 'delivery_zip', label: 'Lerakó Irányítószám' },
    { value: 'delivery_city', label: 'Lerakó Város' },
    { value: 'delivery_address', label: 'Lerakó Cím' },
    { value: 'delivery_date', label: 'Lerakó Ideje' },
    { value: 'cargo_description', label: 'Áru megnevezése' },
    { value: 'weight', label: 'Súly (kg)' },
    { value: 'price', label: 'Fuvardíj' },
    { value: 'currency', label: 'Pénznem' }
];

export default function ExcelImportWizard() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Data from backend
    const [headers, setHeaders] = useState([]);
    const [preview, setPreview] = useState([]);
    const [allData, setAllData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    // User modified mappings
    const [mapping, setMapping] = useState({});

    // Result
    const [importResult, setImportResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/api/import/excel/preview', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setHeaders(res.data.headers);
            setPreview(res.data.preview);
            setAllData(res.data.all_data);
            setTotalRows(res.data.total_rows);

            // Normalize mapping to ensure all mapped values exist in our options
            const initialMapping = {};
            Object.entries(res.data.suggested_mapping).forEach(([key, val]) => {
                if (val && TARGET_FIELDS.find(f => f.value === val)) {
                    initialMapping[key] = val;
                } else {
                    initialMapping[key] = '';
                }
            });
            setMapping(initialMapping);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('Hiba történt a fájl feldolgozásakor.');
        } finally {
            setLoading(false);
        }
    };

    const handleMappingChange = (originalHeader, newTargetField) => {
        setMapping(prev => ({ ...prev, [originalHeader]: newTargetField }));
    };

    const handleConfirmImport = async () => {
        setLoading(true);
        try {
            // Apply mapping to allData
            const mappedData = allData.map(row => {
                const mappedRow = {};
                Object.entries(mapping).forEach(([origCol, targetCol]) => {
                    if (targetCol) {
                        mappedRow[targetCol] = row[origCol];
                    }
                });
                return mappedRow;
            });

            const res = await api.post('/api/import/excel/confirm', { mapped_data: mappedData });
            setImportResult(res.data);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert('Hiba történt az importálás során.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 mb-8">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <h1 className="text-2xl font-bold dark:text-white">Anti-Excel Onboarding (Import)</h1>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 flex justify-center items-center rounded-full ${step >= 1 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>1</div>
                    <span className="font-medium">Fájl feltöltés</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 flex justify-center items-center rounded-full ${step >= 2 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>2</div>
                    <span className="font-medium">Oszlopok párosítása</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 flex justify-center items-center rounded-full ${step >= 3 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>3</div>
                    <span className="font-medium">Kész</span>
                </div>
            </div>

            {step === 1 && (
                <div className="bg-white dark:bg-fleet-dark-surface p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium dark:text-white mb-2">Tölts fel egy Excel (vagy CSV) fájlt</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 font-light">Az AI automatikusan felismeri az oszlopokat és megkísérli párosítani a FleetEgo mezőivel.</p>

                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 mx-auto max-w-sm"
                    />

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-sm w-full max-w-xs"
                    >
                        {loading ? 'Feldolgozás (AI)...' : 'Fájl elemzése'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex items-start">
                        <ExclamationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Ellenőrizd a párosítást!</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                Összesen <b>{totalRows}</b> sort találtunk. Az AI megpróbálta kitalálni, mi micsoda. Kérlek, nézd át és módosítsd, ha tévesztett!
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white dark:bg-fleet-dark-surface shadow rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">Excel Oszlop</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">FleetEgo Mező</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">Minta (első 3 sor)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {headers.map(header => (
                                    <tr key={header} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {header}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={mapping[header] || ''}
                                                onChange={(e) => handleMappingChange(header, e.target.value)}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                {TARGET_FIELDS.map(f => (
                                                    <option key={f.value} value={f.value}>{f.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                            {preview.map((row, idx) => (
                                                <div key={idx} className="truncate">{row[header] !== undefined && row[header] !== null && row[header] !== '' ? String(row[header]) : <span className="text-gray-300 dark:text-gray-600 italic">üres</span>}</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Vissza
                        </button>
                        <button
                            onClick={handleConfirmImport}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
                        >
                            {loading ? 'Importálás folyamatban...' : `Jóváhagyás és ${totalRows} sor importálása`}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && importResult && (
                <div className="bg-white dark:bg-fleet-dark-surface p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center space-y-4">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                    <h3 className="text-xl font-bold dark:text-white">Sikeres Import!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {importResult.imported_count} tétel sikeresen bekerült a FleetEgo rendszerbe.
                    </p>
                    <button
                        onClick={() => {
                            setStep(1);
                            setFile(null);
                        }}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Új fájl importálása
                    </button>
                </div>
            )}
        </div>
    );
}
