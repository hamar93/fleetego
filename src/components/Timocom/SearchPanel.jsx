import React, { useState } from 'react';
import api from '../../api/api'; // Import configured API instance
import './SearchPanel.css'; // We'll assume this inherits from global CSS or create basic styles

const SearchPanel = () => {
    const [criteria, setCriteria] = useState({
        origin: 'Budapest',
        destination: 'München',
        date: '',
        cargo_type: ''
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        try {
            // Use axios instance (automatically handles base URL)
            const response = await api.post('/api/timocom/search', criteria);
            setResults(response.data);
        } catch (error) {
            console.error("Search failed:", error);
            alert("Hiba történt a keresés során. Győződj meg róla, hogy a Backend fut!");
        } finally {
            setLoading(false);
        }
    };

    const checkConnection = async () => {
        try {
            const response = await api.get('/api/timocom/status');
            const data = response.data;
            setStatus(data);
            alert(`Státusz: ${data.status}\nMód: ${data.mode}\nÜzenet: ${data.message}`);
        } catch (error) {
            console.error("Connection check failed:", error);
            alert("Nem sikerült kapcsolódni a szerverhez.");
        }
    };

    return (
        <div className="search-panel-container fade-in">
            <div className="card glass-effect mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="card-title"><i className="fas fa-search"></i> Timocom Fuvar Keresés</h2>
                    <button className="btn btn-secondary btn-sm" onClick={checkConnection}>
                        <i className="fas fa-plug"></i> Kapcsolat Teszt
                    </button>
                </div>

                <form onSubmit={handleSearch} className="search-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Honnan (City/Zip):</label>
                        <input type="text" name="origin" value={criteria.origin} onChange={handleChange} className="form-control" placeholder="pl. Budapest" />
                    </div>
                    <div className="form-group">
                        <label>Hova (City/Zip):</label>
                        <input type="text" name="destination" value={criteria.destination} onChange={handleChange} className="form-control" placeholder="pl. Berlin" />
                    </div>
                    <div className="form-group">
                        <label>Dátum:</label>
                        <input type="date" name="date" value={criteria.date} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'KERESÉS'}
                        </button>
                    </div>
                </form>
            </div>

            {results && (
                <div className="results-area">
                    <h3 className="section-title">Találatok ({results.results?.length || 0}) <small style={{ fontSize: '0.8em', opacity: 0.7 }}>- Forrás: {results.source}</small></h3>
                    <div className="results-grid" style={{ display: 'grid', gap: '1rem' }}>
                        {results.results?.map((item) => (
                            <div key={item.id} className="card glass-effect result-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{item.company}</span>
                                    <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{item.price.amount} {item.price.currency}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <span><i className="fas fa-map-marker-alt text-danger"></i> {item.origin.zip} {item.origin.city}</span>
                                    <i className="fas fa-arrow-right" style={{ opacity: 0.5 }}></i>
                                    <span><i className="fas fa-map-marker-alt text-success"></i> {item.destination.zip} {item.destination.city}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9em', opacity: 0.8 }}>
                                    <span><i className="fas fa-box"></i> {item.cargo.description} ({item.cargo.weight} kg)</span>
                                    <span><i className="fas fa-calendar"></i> {item.pickup_date}</span>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-sm btn-outline-primary">Ajánlat tétel</button>
                                    <button className="btn btn-sm btn-outline-secondary">Részletek</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
