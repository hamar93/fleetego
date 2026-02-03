import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import AddVehicleModal from './AddVehicleModal';
import AssignDriverModal from './AssignDriverModal';
import './VehicleList.css';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [assignModalData, setAssignModalData] = useState(null); // stores vehicle object to assign

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const response = await api.get('/api/fleet/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error("Failed to load vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'on-route';
            case 'idle': return 'idle';
            case 'maintenance': return 'idle';
            case 'offline': return 'offline';
            default: return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Úton';
            case 'idle': return 'Szabad';
            case 'maintenance': return 'Szerviz';
            case 'offline': return 'Offline';
            default: return status;
        }
    };

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'truck': return 'fa-truck';
            case 'trailer': return 'fa-trailer';
            case 'van': return 'fa-shuttle-van';
            default: return 'fa-car';
        }
    };

    if (loading) {
        return (
            <div className="vehicle-list-container fade-in">
                <h2 className="page-title"><i className="fas fa-truck"></i> Járműflotta</h2>
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p>Járművek betöltése...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-list-container fade-in">
            <div className="page-header">
                <h2 className="page-title"><i className="fas fa-truck"></i> Járműflotta</h2>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus"></i> Új Jármű
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p>Járművek betöltése...</p>
                </div>
            ) : (
                <div className="vehicle-grid">
                    {vehicles.length === 0 ? (
                        <div className="empty-state">
                            <p>Nincs jármű a rendszerben. Vegyen fel egyet!</p>
                        </div>
                    ) : (
                        vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="card glass-effect glow-on-hover vehicle-card">
                                <div className="vehicle-card-header">
                                    <div className="vehicle-icon">
                                        <i className={`fas ${getVehicleIcon(vehicle.type)}`}></i>
                                    </div>
                                    <div className="vehicle-info">
                                        <h3 className="vehicle-plate">{vehicle.plate_number}</h3>
                                        <p className="vehicle-model">{vehicle.make} {vehicle.model}</p>
                                    </div>
                                    <div className="vehicle-status">
                                        <span className={`status-indicator ${getStatusClass(vehicle.status)}`}></span>
                                        <span className="status-text">{getStatusLabel(vehicle.status)}</span>
                                    </div>
                                </div>

                                <div className="vehicle-card-body">
                                    <div className="info-row">
                                        <i className="fas fa-user-tie"></i>
                                        <span>{vehicle.current_driver_name || 'Nincs sofőr'}</span>
                                    </div>
                                    <div className="info-row">
                                        <i className="fas fa-tachometer-alt"></i>
                                        <span>{vehicle.mileage.toLocaleString()} km</span>
                                    </div>
                                    {/* Trailer Status Display (if applicable) */}
                                    {vehicle.type === 'trailer' && (
                                        <div className="info-row">
                                            <i className="fas fa-box"></i>
                                            <span>{vehicle.load_status === 'loaded' ? 'Rakott' : 'Üres'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="vehicle-card-footer">
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setAssignModalData(vehicle)}
                                    >
                                        <i className="fas fa-user-plus"></i> Sofőr
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} onSave={loadVehicles} />}

            {assignModalData && (
                <AssignDriverModal
                    vehicle={assignModalData}
                    onClose={() => setAssignModalData(null)}
                    onSave={loadVehicles}
                />
            )}
        </div>
    );
};

export default VehicleList;
