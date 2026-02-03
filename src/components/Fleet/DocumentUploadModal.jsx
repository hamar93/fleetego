import React, { useState } from 'react';
import api from '../../api/api';

const DocumentUploadModal = ({ vehicle, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        // We could append vehicle_id if the backend supported linking, 
        // e.g. formData.append('vehicle_id', vehicle.id); 

        try {
            await api.post('/api/docs/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMsg('Sikeres feltöltés!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Hiba a feltöltés során!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Dokumentum Feltöltése (CMR)</h3>
                <p>{vehicle ? `Jármű: ${vehicle.plate_number}` : 'Általános feltöltés'}</p>

                <div className="form-group">
                    <input type="file" onChange={handleFileChange} className="form-input" accept="image/*,.pdf" />
                </div>

                {successMsg && <div className="success-message">{successMsg}</div>}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Bezárás</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-upload"></i> Feltöltés</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadModal;
