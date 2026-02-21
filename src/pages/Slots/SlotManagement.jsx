import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const SlotManagement = () => {
    const { t } = useTranslation();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('slots');

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await api.get('/slots');
            setSlots(response.data);
        } catch (error) {
            console.error('Failed to fetch slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'BOOKED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ARRIVED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'DELAYED': return 'bg-red-100 text-red-800 border-red-200';
            case 'LOADED':
            case 'UNLOADED': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('slots_page.title')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('slots_page.subtitle')}</p>
                </div>
                <button
                    onClick={fetchSlots}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <i className={`fas fa-sync-alt text-gray-500 ${loading ? 'fa-spin' : ''}`}></i>
                    <span className="text-sm font-medium">{t('common.refresh')}</span>
                </button>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('slots')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'slots'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    {t('slots_page.tab_slots')}
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'report'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    {t('slots_page.tab_report')}
                </button>
            </div>

            {activeTab === 'slots' && (
                <>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <th className="p-4 font-semibold">{t('slots_page.col_type')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_address')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_date')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_time_window')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_vehicle_order')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_wait_time')}</th>
                                        <th className="p-4 font-semibold">{t('slots_page.col_status')}</th>
                                        <th className="p-4 font-semibold text-right">{t('slots_page.col_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-700/50">
                                    {slots.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-gray-500">
                                                {loading ? t('common.loading') : t('slots_page.no_slots')}
                                            </td>
                                        </tr>
                                    ) : (
                                        slots.map(slot => (
                                            <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">
                                                    {slot.stop_type === 'LOADING' ? (
                                                        <span className="flex items-center gap-1.5"><i className="fas fa-box-open text-blue-500"></i> {t('slots_page.type_loading')}</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5"><i className="fas fa-box text-green-500"></i> {t('slots_page.type_unloading')}</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {slot.address?.city || '?'} ({slot.address?.country || '?'})
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {slot.earliestLoadingDate || '-'}
                                                </td>
                                                <td className="p-4 font-mono text-gray-700 dark:text-gray-300">
                                                    {slot.startTime || '??:??'} - {slot.endTime || '??:??'}
                                                </td>
                                                <td className="p-4 text-gray-500 text-xs">
                                                    <div>Veh: {slot.vehicle_id.substring(0, 8)}...</div>
                                                    <div>Ord: {slot.order_id.substring(0, 8)}...</div>
                                                </td>
                                                <td className="p-4">
                                                    {slot.status === 'DELAYED' ? (
                                                        <span className="text-red-600 font-medium flex items-center gap-1"><i className="fas fa-clock"></i> {t('slots_page.eta_delay')}</span>
                                                    ) : slot.status === 'LOADED' || slot.status === 'UNLOADED' ? (
                                                        <span className="text-gray-500">{t('slots_page.completed')}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusColor(slot.status)}`}>
                                                        {slot.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title={t('common.details')}>
                                                        <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                            <i className="fas fa-plus"></i> {t('slots_page.new_booking_btn')}
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'report' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('slots_page.avg_wait')}</h3>
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">1ó 15p</div>
                        <p className="text-sm text-gray-500 mt-2">{t('slots_page.avg_wait_desc')}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('slots_page.worst_location')}</h3>
                        <div className="text-xl font-bold text-red-600 dark:text-red-400">DE-80331 München</div>
                        <p className="text-sm text-gray-500 mt-2">{t('slots_page.worst_location_desc')}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('slots_page.compliance_rate')}</h3>
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">85%</div>
                        <p className="text-sm text-gray-500 mt-2">{t('slots_page.compliance_desc')}</p>
                    </div>
                    <div className="col-span-1 md:col-span-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 h-64 flex items-center justify-center">
                        <p className="text-gray-500 flex flex-col items-center">
                            <i className="fas fa-chart-bar text-4xl mb-4 text-gray-300"></i>
                            {t('slots_page.chart_placeholder')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotManagement;
