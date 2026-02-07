import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const PartnerList = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        zip_code: '',
        contact_person: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await api.get('/api/partners');
            setPartners(res.data);
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/partners', formData);
            fetchPartners();
            setIsModalOpen(false);
            setFormData({ name: '', address: '', city: '', zip_code: '', contact_person: '', email: '', phone: '' });
        } catch (error) {
            alert('Hiba a partner létrehozásakor!');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partnerek Kezelése</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + Új Partner
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Betöltés...</div>
            ) : partners.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Nincsenek felvett partnerek.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map(partner => (
                        <div key={partner.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p><i className="fas fa-map-marker-alt w-5"></i> {partner.zip_code} {partner.city}, {partner.address}</p>
                                {partner.contact_person && <p><i className="fas fa-user w-5"></i> {partner.contact_person}</p>}
                                {partner.email && <p><i className="fas fa-envelope w-5"></i> {partner.email}</p>}
                                {partner.phone && <p><i className="fas fa-phone w-5"></i> {partner.phone}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Új Partner Felvétele</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cégnév</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Irszám</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.zip_code}
                                        onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Város</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cím</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapcsolattartó</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.contact_person}
                                    onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Mégse
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Létrehozás
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerList;
