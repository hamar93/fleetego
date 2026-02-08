import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';

const DispatchCalendar = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ resources: [], events: [], range: {} });
    const [viewType, setViewType] = useState('drivers'); // 'drivers' or 'vehicles'
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchTimeline();
    }, [currentDate, viewType]);

    const fetchTimeline = async () => {
        setLoading(true);
        try {
            // Calculate start/end of week based on currentDate
            const start = new Date(currentDate);
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);

            const startIso = start.toISOString();
            const endIso = end.toISOString();

            const res = await api.get(`/api/dispatch/timeline?start_date=${startIso}&end_date=${endIso}&view_type=${viewType}`);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch timeline", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const getWeekRangeString = () => {
        if (!data.range.start) return "";
        const s = new Date(data.range.start);
        const e = new Date(data.range.end);
        return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`;
    };

    // Rendering Helpers
    const getEventStyle = (event, rangeStart, rangeEnd) => {
        const totalMs = rangeEnd - rangeStart;

        let startMs = new Date(event.start).getTime();
        let endMs = new Date(event.end).getTime();

        // Clip to range
        if (startMs < rangeStart) startMs = rangeStart;
        if (endMs > rangeEnd) endMs = rangeEnd;
        if (startMs > endMs) return { display: 'none' }; // Should not happen if filtered correctly

        const left = ((startMs - rangeStart) / totalMs) * 100;
        const width = ((endMs - startMs) / totalMs) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`,
            backgroundColor: event.bgColor || '#3b82f6',
        };
    };

    return (
        <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📅 Dispatch Calendar</h1>

                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewType('drivers')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${viewType === 'drivers' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Sofőrök
                        </button>
                        <button
                            onClick={() => setViewType('vehicles')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${viewType === 'vehicles' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Járművek
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-1">
                        <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">◀️</button>
                        <span className="font-medium px-2 dark:text-gray-200">{getWeekRangeString()}</span>
                        <button onClick={handleNextWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">▶️</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">

                    {/* Header Row (Days) */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="w-48 flex-shrink-0 p-3 font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                            Erőforrás
                        </div>
                        <div className="flex-1 flex relative">
                            {Array.from({ length: 7 }).map((_, i) => {
                                const d = new Date(data.range.start);
                                d.setDate(d.getDate() + i);
                                return (
                                    <div key={i} className="flex-1 text-center py-2 border-r border-gray-100 dark:border-gray-700 last:border-0">
                                        <div className="text-xs text-gray-400 uppercase">{d.toLocaleDateString([], { weekday: 'short' })}</div>
                                        <div className="text-sm font-bold dark:text-white">{d.getDate()}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Body (Scrollable) */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="relative">
                            {/* Grid Lines (Background) */}
                            <div className="absolute inset-0 flex ml-48 pointer-events-none">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className="flex-1 border-r border-gray-100 dark:border-gray-700/50 h-full"></div>
                                ))}
                            </div>

                            {/* Resource Rows */}
                            {data.resources.map(res => (
                                <div key={res.id} className="flex border-b border-gray-100 dark:border-gray-700 relative hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors min-h-[60px]">
                                    {/* Resource Info */}
                                    <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] sticky left-0 z-10 flex flex-col justify-center">
                                        <div className="font-bold text-gray-900 dark:text-white truncate" title={res.title}>{res.title}</div>
                                        <div className="text-xs text-gray-500 truncate">{res.plate || res.email}</div>
                                    </div>

                                    {/* Timeline Area */}
                                    <div className="flex-1 relative h-16">
                                        {data.events
                                            .filter(evt => evt.resourceId === res.id)
                                            .map(evt => {
                                                const rangeStart = new Date(data.range.start).getTime();
                                                const rangeEnd = new Date(data.range.end).getTime();
                                                const style = getEventStyle(evt, rangeStart, rangeEnd);

                                                return (
                                                    <div
                                                        key={evt.id}
                                                        className={`absolute top-2 bottom-2 rounded-md px-2 text-xs text-white flex items-center overflow-hidden whitespace-nowrap shadow-sm cursor-pointer hover:opacity-90 transition-opacity z-0 ${evt.isBackground ? 'opacity-60 h-4 top-6' : ''}`}
                                                        style={style}
                                                        title={`${evt.title} (${new Date(evt.start).toLocaleString()})`}
                                                    >
                                                        {evt.type === 'order' && <span className="mr-1">🚛</span>}
                                                        <span className="truncate">{evt.title}</span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}

                            {data.resources.length === 0 && (
                                <div className="p-8 text-center text-gray-500">Nincs megjeleníthető adat a kiválasztott időszakra.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DispatchCalendar;
