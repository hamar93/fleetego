import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const DispatchBoard = () => {
    const [loading, setLoading] = useState(true);
    const [timelineData, setTimelineData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Defaults to today, viewing current week
    const [filterText, setFilterText] = useState('');
    const [now, setNow] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [draggedEvent, setDraggedEvent] = useState(null);
    const [complianceWarning, setComplianceWarning] = useState(null);
    const [verifyingDrop, setVerifyingDrop] = useState(false);

    useEffect(() => {
        fetchTimeline();
    }, [selectedDate]);

    // Update 'now' every minute
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchTimeline = async () => {
        setLoading(true);
        try {
            // Calculate start/end of week based on selectedDate
            const current = new Date(selectedDate);
            const day = current.getDay();
            const diff = current.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            const monday = new Date(current.setDate(diff));
            const sunday = new Date(current.setDate(diff + 6));

            // Format YYYY-MM-DD
            const startStr = monday.toISOString().split('T')[0];
            const endStr = sunday.toISOString().split('T')[0];

            const res = await api.get(`/api/dispatch/timeline?start_date=${startStr}&end_date=${endStr}`);
            setTimelineData(res.data);
        } catch (error) {
            console.error("Timeline error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    // Helper to calculate position
    const getEventStyle = (event, rangeStart, rangeEnd) => {
        const start = new Date(event.start).getTime();
        const end = new Date(event.end).getTime();
        const min = new Date(rangeStart).getTime();
        const max = new Date(rangeEnd).getTime();
        const totalDuration = max - min;

        // Clip to range
        const effectiveStart = Math.max(start, min);
        const effectiveEnd = Math.min(end, max);

        const left = ((effectiveStart - min) / totalDuration) * 100;
        const width = ((effectiveEnd - effectiveStart) / totalDuration) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`
        };
    };

    const getCurrentTimePosition = (rangeStart, rangeEnd) => {
        const current = now.getTime();
        const min = new Date(rangeStart).getTime();
        const max = new Date(rangeEnd).getTime();

        if (current < min || current > max) return null;

        const totalDuration = max - min;
        return ((current - min) / totalDuration) * 100;
    };

    // Drag & Drop Handlers
    const handleDragStart = (evt) => {
        setDraggedEvent(evt);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow drop
    };

    const handleDrop = async (targetResource) => {
        if (!draggedEvent || draggedEvent.resourceId === targetResource.id) {
            setDraggedEvent(null);
            return;
        }

        if (targetResource.driver_id) {
            setVerifyingDrop(true);
            try {
                const res = await api.post('/api/dispatch/plan', {
                    order_id: draggedEvent.id, // ID is standard hex ObjectId
                    driver_id: targetResource.driver_id
                });

                if (res.data && res.data.is_legal === false) {
                    setComplianceWarning({
                        event: draggedEvent,
                        resource: targetResource,
                        result: res.data
                    });
                    setVerifyingDrop(false);
                    return; // Wait for modal action
                }
            } catch (err) {
                console.error("Compliance API failed, proceeding anyway", err);
            }
            setVerifyingDrop(false);
        }

        await confirmAssignment(draggedEvent, targetResource);
    };

    const confirmAssignment = async (event, resource) => {
        setVerifyingDrop(true);
        try {
            await api.patch(`/api/orders/${event.id}`, {
                assigned_vehicle_id: resource.plate
            });

            setTimelineData(prev => ({
                ...prev,
                events: prev.events.map(evt =>
                    evt.id === event.id
                        ? { ...evt, resourceId: resource.id }
                        : evt
                )
            }));
        } catch (error) {
            console.error("Drop error:", error);
        } finally {
            setVerifyingDrop(false);
            setDraggedEvent(null);
            setComplianceWarning(null);
        }
    };

    if (loading && !timelineData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const start = new Date(timelineData?.range.start);
    const end = new Date(timelineData?.range.end);

    // Generate headers (days)
    const headers = [];
    const temp = new Date(start);
    while (temp <= end) {
        headers.push(new Date(temp));
        temp.setDate(temp.getDate() + 1);
    }

    // Filter Logic
    // Filter Logic safely
    const filteredResources = timelineData?.resources?.filter(res => {
        const p = res.plate || '';
        const d = res.driver || '';
        const search = (filterText || '').toLowerCase();
        return p.toLowerCase().includes(search) || d.toLowerCase().includes(search);
    }) || [];

    const nowPos = getCurrentTimePosition(start, end);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6 text-[var(--text-primary)] flex flex-col">
            <div className="max-w-[1600px] w-full mx-auto space-y-6 flex-1 flex flex-col">

                {/* Header controls */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fuvartervezés</h1>
                        <p className="text-sm text-gray-500">Heti nézet: {start.toLocaleDateString()} - {end.toLocaleDateString()}</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Keresés rendszámra, sofőrre..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handlePrevWeek} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                            ◀
                        </button>
                        <button onClick={() => setSelectedDate(new Date())} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                            Ma
                        </button>
                        <button onClick={handleNextWeek} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                            ▶
                        </button>
                    </div>
                </div>

                {/* Timeline Container */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col relative">

                    {/* Absolute Current Time Line (Spanning Full Height) */}
                    {nowPos !== null && (
                        <div
                            className="absolute top-12 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
                            style={{ left: `calc(16rem + ${nowPos}%)` }} // 16rem is sidebar width
                        >
                            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                    )}

                    {/* Header Row (Dates) */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {/* Empty corner for Resources */}
                        <div className="w-64 flex-shrink-0 p-4 font-bold text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
                            Jármű / Sofőr
                        </div>
                        {/* Days */}
                        <div className="flex-1 grid grid-cols-7">
                            {headers.map((date, idx) => {
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                const isToday = date.toDateString() === now.toDateString();
                                return (
                                    <div key={idx} className={`border-r border-gray-100 dark:border-gray-700 p-2 text-center last:border-r-0
                                        ${isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}
                                        ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                                    `}>
                                        <div className={`text-xs uppercase font-semibold ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('hu-HU', { weekday: 'short' })}
                                        </div>
                                        <div className={`text-lg font-bold ${isToday ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                                            {date.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resources Rows */}
                    <div className="overflow-y-auto flex-1 relative">
                        {filteredResources.map(res => (
                            <div
                                key={res.id}
                                className={`flex border-b border-gray-100 dark:border-gray-700 h-24 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group
                                    ${draggedEvent && draggedEvent.resourceId !== res.id ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                                    ${verifyingDrop ? 'opacity-75 pointer-events-none' : ''}
                                `}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(res)}
                            >
                                {/* Resource Info */}
                                <div className="w-64 flex-shrink-0 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-center bg-white dark:bg-[#1e293b] sticky left-0 z-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/30">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{res.plate}</span>
                                        <span className={`w-2 h-2 rounded-full ${res.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span>👤</span> {res.driver}
                                    </div>
                                    <div className="mt-2 text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded w-fit text-gray-500 uppercase">
                                        {res.type}
                                    </div>
                                </div>

                                {/* Timeline Track */}
                                <div className="flex-1 relative grid grid-cols-7">
                                    {/* Background Columns for Grid & Weekend Highlight */}
                                    {headers.map((date, idx) => {
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        return (
                                            <div key={idx} className={`border-r border-gray-100 dark:border-gray-700 h-full
                                                ${isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}
                                            `}></div>
                                        );
                                    })}

                                    {/* Events Layer (Absolute over grid) */}
                                    <div className="absolute inset-0 top-2 bottom-2">
                                        {(timelineData.events || [])
                                            .filter(evt => evt.resourceId === res.id)
                                            .map(evt => (
                                                <div
                                                    key={evt.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(evt)}
                                                    onClick={() => setSelectedEvent(evt)}
                                                    className={`absolute top-0 bottom-0 rounded-md shadow-sm border border-white/20 px-2 py-1 text-xs text-white overflow-hidden whitespace-nowrap cursor-grab active:cursor-grabbing hover:brightness-110 hover:z-10 transition-all
                                                        ${evt.color === 'green' ? 'bg-green-600' :
                                                            evt.color === 'blue' ? 'bg-blue-600' :
                                                                evt.color === 'orange' ? 'bg-orange-500' : 'bg-indigo-600'
                                                        }
                                                        ${draggedEvent?.id === evt.id ? 'opacity-50' : ''}
                                                    `}
                                                    style={getEventStyle(evt, timelineData.range.start, timelineData.range.end)}
                                                    title={evt.title}
                                                >
                                                    <div className="font-bold text-[10px] leading-tight">{evt.orderNumber}</div>
                                                    <div className="opacity-90 truncate text-[10px]">{evt.title}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredResources.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                {filterText ? 'Nincs a keresésnek megfelelő jármű.' : 'Nincs megjeleníthető jármű.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${selectedEvent.color === 'green' ? 'bg-green-500' : selectedEvent.color === 'blue' ? 'bg-blue-500' : selectedEvent.color === 'orange' ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.orderNumber}</h2>
                            <span className={`ml-auto text-xs px-2 py-1 rounded font-medium uppercase
                                ${selectedEvent.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    selectedEvent.status === 'transit' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'}`}>
                                {selectedEvent.status}
                            </span>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="text-gray-500 mb-1">Útvonal</div>
                                <div className="font-medium text-gray-900 dark:text-white">{selectedEvent.title}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-gray-500 mb-1">Indulás</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{new Date(selectedEvent.start).toLocaleString('hu-HU')}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Érkezés</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{new Date(selectedEvent.end).toLocaleString('hu-HU')}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Compliance Modal */}
            {complianceWarning && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { setComplianceWarning(null); setDraggedEvent(null); }}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            ⚠️
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">EU561 Konfliktus!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                            A kiválasztott sofőr (<span className="font-semibold text-gray-900 dark:text-gray-200">{complianceWarning.resource.driver}</span>) a rendszer adatai szerint <strong>kifut a vezetési időből</strong>, ha elvállalja ezt a fuvart!
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl text-left text-sm font-semibold mb-6 flex flex-col gap-2 border border-red-100 dark:border-red-900/50">
                            {complianceWarning.result?.issues?.map((issue, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>{issue}</span>
                                </div>
                            )) || "Nincs elég vezetési idő."}
                        </div>

                        <div className="flex gap-3 relative">
                            <button
                                onClick={() => { setComplianceWarning(null); setDraggedEvent(null); }}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                            >
                                Mégse (Visszavonás)
                            </button>
                            <button
                                onClick={() => confirmAssignment(complianceWarning.event, complianceWarning.resource)}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors border border-transparent"
                            >
                                Kiosztás Mindenképp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DispatchBoard;
