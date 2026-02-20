import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const SecuritySettings = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [isEnabled, setIsEnabled] = useState(user.is_2fa_enabled || false);
    const [setupData, setSetupData] = useState(null); // { qr_code, secret }
    const [verifyCode, setVerifyCode] = useState('');
    const [disablePassword, setDisablePassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    useEffect(() => {
        // Refresh user data to get latest 2FA status
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/api/auth/me');
            setUser(res.data);
            setIsEnabled(res.data.is_2fa_enabled);
            // Update local storage
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            console.error("Failed to fetch user", error);
        }
    };

    const startSetup = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.post('/api/auth/2fa/setup');
            setSetupData(res.data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Nem sikerült elindítani a beállítást.' });
        } finally {
            setLoading(false);
        }
    };

    const verifyAndEnable = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/api/auth/2fa/verify', { code: verifyCode });
            setIsEnabled(true);
            setSetupData(null);
            setMessage({ type: 'success', text: 'Kétlépcsős azonosítás sikeresen bekapcsolva! 🔒' });

            // Re-fetch to confirm and update storage
            fetchUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Hibás kód.' });
        } finally {
            setLoading(false);
        }
    };

    const disable2FA = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/api/auth/2fa/disable', { password: disablePassword });
            setIsEnabled(false);
            setDisablePassword('');
            setMessage({ type: 'success', text: 'Kétlépcsős azonosítás kikapcsolva.' });
            fetchUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Hiba a kikapcsoláskor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-card animate-fadeIn">
            <h3 className="card-title text-xl mb-6">
                <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
                Biztonsági Beállítások
            </h3>

            <div className={`p-4 rounded-lg border mb-6 flex items-center justify-between
                ${isEnabled ? 'bg-green-50/10 border-green-500/30' : 'bg-gray-50/5 border-gray-600'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                        ${isEnabled ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        <i className={`fas fa-${isEnabled ? 'lock' : 'unlock'}`}></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)]">
                            {isEnabled ? 'Kétlépcsős Azonosítás (2FA) Aktív' : 'Kétlépcsős Azonosítás (2FA) Kikapcsolva'}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {isEnabled
                                ? 'Fiókja fokozottan védett. Bejelentkezéskor meg kell adnia az alkalmazásban generált kódot.'
                                : 'Azonosításához egy második lépcső (kód) hozzáadása javasolt.'}
                        </p>
                    </div>
                </div>

                {!isEnabled && !setupData && (
                    <button onClick={startSetup} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors" disabled={loading}>
                        {loading ? '...' : 'Bekapcsolás'}
                    </button>
                )}
            </div>

            {/* Setup Flow */}
            {setupData && !isEnabled && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                    <h4 className="font-bold mb-4 text-[var(--text-primary)]">Beállítás Lépései:</h4>
                    <ol className="list-decimal pl-5 space-y-3 text-[var(--text-secondary)] mb-6">
                        <li>Töltsön le egy hitelesítő alkalmazást (pl. Google Authenticator, Authy).</li>
                        <li>Olvassa be az alábbi QR kódot:</li>
                        <li>Írja be az alkalmazásban megjelenő 6-jegyű kódot.</li>
                    </ol>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="bg-white p-2 rounded-lg">
                            <img src={`data:image/png;base64,${setupData.qr_code}`} alt="QR Code" className="w-48 h-48" />
                        </div>

                        <div className="w-full max-w-xs space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Ellenőrző Kód</label>
                                <input
                                    type="text"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value)}
                                    placeholder="000 000"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--text-primary)] tracking-widest text-center text-lg"
                                    maxLength="6"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={verifyAndEnable}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
                                    disabled={loading || verifyCode.length < 6}
                                >
                                    {loading ? 'Ellenőrzés...' : 'Aktiválás'}
                                </button>
                                <button
                                    onClick={() => setSetupData(null)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-[var(--text-primary)] rounded-lg"
                                >
                                    Mégse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Disable Flow */}
            {isEnabled && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="font-bold mb-2 text-red-500">Kikapcsolás (Veszélyzóna)</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        A védelem kikapcsolása csökkenti a fiók biztonságát. A folytatáshoz adja meg jelszavát.
                    </p>
                    <div className="flex gap-4 items-center max-w-md">
                        <input
                            type="password"
                            value={disablePassword}
                            onChange={(e) => setDisablePassword(e.target.value)}
                            placeholder="Jelenlegi jelszó"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[var(--text-primary)]"
                        />
                        <button
                            onClick={disable2FA}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            disabled={!disablePassword || loading}
                        >
                            {loading ? '...' : 'Kikapcsolás'}
                        </button>
                    </div>
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default SecuritySettings;
