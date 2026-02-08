import React, { useState, useEffect } from 'react';
import { issueApi } from '../../../api/issue';
import { useTranslation } from 'react-i18next';

const IssueList = () => {
    const { t } = useTranslation();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('open'); // open, in_progress, resolved

    useEffect(() => {
        loadIssues();
    }, [filter]);

    const loadIssues = async () => {
        setLoading(true);
        try {
            // If filter is 'all', don't send status param
            const status = filter === 'all' ? null : filter;
            const data = await issueApi.getAll({ status });
            setIssues(data);
        } catch (error) {
            console.error("Failed to load issues", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await issueApi.update(id, { status: newStatus });
            loadIssues(); // Refresh list
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'text-red-600 bg-red-100 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default: return 'text-blue-600 bg-blue-100 border-blue-200';
        }
    };

    if (loading && issues.length === 0) {
        return <div className="p-4 text-center">Loading issues...</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    <i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
                    Hibabejelentések
                </h3>
                <div className="flex gap-2">
                    {['open', 'in_progress', 'resolved', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${filter === status
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-gray-100'
                                }`}
                        >
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {issues.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Nincs megjeleníthető hiba.
                    </div>
                ) : (
                    issues.map(issue => (
                        <div key={issue._id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getPriorityColor(issue.priority)} uppercase`}>
                                        {issue.priority}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        {issue.type}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(issue.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">
                                {issue.description}
                            </p>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {issue.vehicle_id ? (
                                        <span className="flex items-center gap-1">
                                            <i className="fas fa-truck"></i> {issue.vehicle_id}
                                        </span>
                                    ) : (
                                        <span className="italic">Nincs járműhöz kötve</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {issue.status === 'open' && (
                                        <button
                                            onClick={() => handleStatusChange(issue._id, 'in_progress')}
                                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-100"
                                        >
                                            <i className="fas fa-play mr-1"></i> Javítás kezdése
                                        </button>
                                    )}
                                    {issue.status === 'in_progress' && (
                                        <button
                                            onClick={() => handleStatusChange(issue._id, 'resolved')}
                                            className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg border border-green-100 hover:bg-green-100"
                                        >
                                            <i className="fas fa-check mr-1"></i> Megoldva
                                        </button>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${issue.status === 'resolved' ? 'text-green-600 bg-green-50' : 'text-gray-500'
                                        }`}>
                                        {issue.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IssueList;
