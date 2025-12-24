import React, { useState } from 'react';

const WebhookSimulator = ({ onIngest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [jsonPayload, setJsonPayload] = useState(JSON.stringify({
        "transaction_id": "TRX-" + Math.floor(Math.random() * 10000),
        "raw_text": "AKTA JUAL BELI... Pihak Pertama: Budi...",
        "confidence_score": 0.98,
        "image_url": "https://example.com/scan_001.jpg",
        "lokasi_fisik": "Gedung A/Lantai 1/Rak 05/Box 10",
        "ocr_response": {
            "parties": ["Budi", "Siti"],
            "dates": ["2023-10-20"]
        },
        "metadata": {
            "scanner_id": "SCN-01",
            "resolution": "300dpi"
        },
        "suggested_category": "Akta Jual Beli"
    }, null, 2));

    const handleSimulate = () => {
        try {
            const payload = JSON.parse(jsonPayload);
            onIngest(payload);
            // Reset ID for next simulation
            const newPayload = { ...payload, transaction_id: "TRX-" + Math.floor(Math.random() * 10000) };
            setJsonPayload(JSON.stringify(newPayload, null, 2));
            alert("Webhook Payload Received & Processed");
        } catch (e) {
            alert("Invalid JSON");
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    fontWeight: 600
                }}
            >
                Simulate Inbound Webhook
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            padding: '20px',
            zIndex: 9999,
            border: '1px solid #E5E7EB'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Akira Webhook Simulator</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                    ×
                </button>
            </div>

            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 10px 0' }}>
                Simulate an incoming POST request from the Akira OCR engine.
            </p>

            <textarea
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                style={{
                    width: '100%',
                    height: '200px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    resize: 'vertical'
                }}
            />

            <button
                onClick={handleSimulate}
                style={{
                    width: '100%',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                Send Payload
            </button>
        </div>
    );
};

export default WebhookSimulator;
