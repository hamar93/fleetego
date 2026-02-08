import React, { useState } from 'react';
import { issueApi } from '../../../api/issue';

const IssueForm = ({ onIssueCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        type: 'mechanical',
        priority: 'medium',
        description: '',
        vehicle_id: '', // Optional: could be a dropdown in future
        driver_id: ''   // Optional
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await issueApi.create(formData);
            onIssueCreated();
            // Reset form
            setFormData({
                type: 'mechanical',
                priority: 'medium',
                description: '',
                vehicle_id: '',
                driver_id: ''
            });
        } catch (error) {
            console.error("Failed to report issue", error);
            alert("Hiba történt a bejelentéskor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Új hiba bejelentése</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Típus</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="mechanical">Műszaki hiba</option>
                        <option value="accident">Baleset / Sérülés</option>
                        <option value="delay">Késés ok</option>
                        <option value="administrative">Adminisztráció</option>
                        <option value="other">Egyéb</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioritás</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="low">Alacsony</option>
                        <option value="medium">Közepes</option>
                        <option value="high">Magas</option>
                        <option value="critical">Kritikus</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leírás</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Írd le a probléma részleteit..."
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rendszám (Opcionális)</label>
                    <input
                        type="text"
                        name="vehicle_id"
                        value={formData.vehicle_id}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        placeholder="pl. ABC-123"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Mégse
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Küldés...' : 'Bejelentés küldése'}
                </button>
            </div>
        </form>
    );
};

export default IssueForm;
