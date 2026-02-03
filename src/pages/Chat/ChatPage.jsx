import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';
import './Chat.css';

const ChatPage = () => {
    const { t } = useTranslation();
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    // 1. Initialize: Fetch User & Rooms
    useEffect(() => {
        const init = async () => {
            try {
                // Get current user details from profile or local storage if stored
                // For now, let's fetch profile or assume ID from somewhere. 
                // A better way is to decode token or hit /auth/me
                const userRes = await api.get('/api/auth/profile');
                setCurrentUser(userRes.data);

                fetchRooms();
                connectWebSocket(userRes.data.id);
            } catch (error) {
                console.error("Chat init failed:", error);
            }
        };
        init();

        return () => {
            if (socket) socket.close();
        };
    }, []);

    // 2. Fetch Rooms
    const fetchRooms = async () => {
        try {
            const res = await api.get('/api/chat/rooms');
            setRooms(res.data);
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        }
    };

    // 3. Connect WebSocket
    const connectWebSocket = (userId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Determine protocol (ws or wss)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
        // Adjust for backend URL if different
        const wsUrl = `ws://localhost:8000/api/chat/ws/${userId}?token=${token}`; // TODO: Use env var for base URL

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to Chat WS");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleIncomingMessage(data);
        };

        ws.onclose = () => {
            console.log("Chat WS Disconnected");
        };

        setSocket(ws);
    };

    const handleIncomingMessage = (message) => {
        // If message belongs to active room, append it
        setMessages(prev => {
            // Check if we already have it (optimistic update vs broadcast)
            if (prev.find(m => m.id === message.id)) return prev;

            if (activeRoom && message.room_id === activeRoom.id) {
                return [...prev, message];
            }
            return prev;
        });

        // Update last message in room list
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.id === message.room_id) {
                    return { ...room, last_message: message, updated_at: message.timestamp };
                }
                return room;
            }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
    };

    // 4. Select Room
    const handleRoomSelect = async (room) => {
        setActiveRoom(room);
        try {
            const res = await api.get(`/api/chat/rooms/${room.id}/messages`);
            setMessages(res.data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    // 5. Send Message
    const handleSend = () => {
        if (!newMessage.trim() || !socket || !activeRoom) return;

        const msgPayload = {
            room_id: activeRoom.id,
            content: newMessage,
            type: "text"
        };

        socket.send(JSON.stringify(msgPayload));

        // Optimistic update handled by WS broadcast usually, but we can do it here too if needed.
        // For now rely on broadcast back from server to ensure ID and timestamp are correct.

        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Format Users in Room (Helper)
    const getRoomName = (room) => {
        if (room.name) return room.name;
        // If direct, show other participant's ID (or Name if we had it)
        // Ideally backend populates names. For now showing ID as fallback.
        const otherId = room.participants.find(p => p !== currentUser?.id);
        return `User ${otherId ? otherId.substring(0, 6) : 'Unknown'}`;
    };

    return (
        <div className="fade-in">
            <div className="page-header" style={{ marginBottom: '1rem' }}>
                <h2 className="header-title">{t('sidebar.chat')}</h2>
            </div>

            <div className="chat-container">
                {/* Sidebar List */}
                <div className="chat-sidebar">
                    <div className="chat-header">
                        <span>{t('sidebar.main')}</span>
                        <button className="btn-icon-small"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="chat-list">
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                className={`chat-room-item ${activeRoom?.id === room.id ? 'active' : ''}`}
                                onClick={() => handleRoomSelect(room)}
                            >
                                <div className="avatar-circle">
                                    {getRoomName(room).charAt(0).toUpperCase()}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {getRoomName(room)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {room.last_message ? room.last_message.content : 'Nincs üzenet'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="chat-main">
                    {activeRoom ? (
                        <>
                            <div className="chat-header">
                                {getRoomName(activeRoom)}
                            </div>

                            <div className="messages-area">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`message-bubble ${msg.sender_id === currentUser?.id ? 'mine' : 'theirs'}`}
                                    >
                                        {msg.content}
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Írjon egy üzenetet..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className="send-btn" onClick={handleSend}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-comments" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <h3>Válasszon egy beszélgetést</h3>
                            <p>vagy indítson újat a kollégákkal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
