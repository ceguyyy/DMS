import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import IngestionDashboard from './components/IngestionDashboard';
import DataPreviewer from './components/DataPreviewer';
import AuditTrail from './components/AuditTrail';
import GlobalSearch from './components/GlobalSearch';
import WebhookSimulator from './components/WebhookSimulator';
import DriveView from './components/DriveView';

const initialBatches = [
  {
    id: "BATCH-001",
    file: "Scan_Sertifikat_BDG.pdf",
    cat: "SHM",
    status: "STORED", /* was DRAFT */
    date: "20 Oct 2025",
    physicalLocation: { building: 'Gedung A', level: 'Lantai 1', rack: 'Rak 05', box: 'Box 10' }
  },
  {
    id: "BATCH-002",
    file: "Scan_Akta_Tanah.jpg",
    cat: "AJB",
    status: "VALIDATING", /* was DRAFT */
    date: "21 Oct 2025",
    physicalLocation: { building: 'Gedung A', level: 'Lantai 1', rack: 'Rak 05', box: 'Box 12' }
  },
  {
    id: "BATCH-003",
    file: "Scan_Warkah_09.pdf",
    cat: "WARKAH",
    status: "INCOMING", /* was PROCESSING */
    date: "22 Oct 2025",
    physicalLocation: { building: 'Gedung B', level: 'Lantai 2', rack: 'Rak 01', box: 'Box 03' }
  }
];

const mockQCData = {
  "BATCH-001": {
    id: "BATCH-001",
    title: "SERTIFIKAT",
    ocrContent: {
      no: "10.05.02.01",
      provinsi: "JAWA BARAT",
      pemegang: "BUDI SANTOSO",
      tanggal: "20 OKTOBER 2023",
      luas: "500 M2"
    },
    rawText: `{"text": "Sertifikat Hak Milik No 10.05.02.01...", "confidence": 0.92}`,
    physicalLocation: {
      building: 'LOC-001',
      level: 'LOC-002',
      room: 'LOC-003',
      rack: 'LOC-004',
      box: 'LOC-005'
    }
  },
  "BATCH-002": {
    id: "BATCH-002",
    title: "AKTA JUAL BELI",
    ocrContent: {
      no: "AJB-2023-999",
      provinsi: "DKI JAKARTA",
      pemegang: "PT PROPERTI INDO",
      tanggal: "15 AGUSTUS 2024",
      luas: "1200 M2"
    },
    rawText: `{"text": "Akta Jual Beli No AJB-2023-999...", "confidence": 0.88}`,
    physicalLocation: {
      building: 'LOC-999',
      level: '',
      room: '',
      rack: '',
      box: ''
    }
  }
};

function App() {
  const [view, setView] = useState('ingestion'); // 'ingestion' | 'qc'
  const [batches, setBatches] = useState(initialBatches);
  const [activeBatchId, setActiveBatchId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState([
    { id: 'CAT-001', name: 'Sertifikat Hak Milik (SHM)', code: 'SHM', folder: 'C://legal/land/shm' },
    { id: 'CAT-002', name: 'Akta Jual Beli (AJB)', code: 'AJB', folder: 'C://legal/land/ajb' },
    { id: 'CAT-003', name: 'Izin Mendirikan Bangunan', code: 'IMB', folder: 'C://permits/construction' }
  ]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1001, time: '2025-10-23 14:20:01', user: 'System (Sync Worker)', action: 'SYNC_SUCCESS', details: 'Batch-001 synced to DMS. Receipt: #99281' },
    { id: 1002, time: '2025-10-23 14:15:30', user: 'Christian Gunawan', action: 'APPROVE_DOC', details: 'Approved Document ID: doc_88291' },
    { id: 1003, time: '2025-10-23 14:10:12', user: 'Christian Gunawan', action: 'LOGIN', details: 'User logged in successfully' },
    { id: 1004, time: '2025-10-23 14:05:00', user: 'Scanner_01', action: 'UPLOAD_BATCH', details: 'Uploaded 50 files. Batch ID: BATCH-003' },
    { id: 1005, time: '2025-10-23 14:00:22', user: 'Akira OCR', action: 'OCR_CALLBACK', details: 'Processed 50 files. Success: 49, Failed: 1' }
  ]);

  const handleAddLog = (action, details, user = 'Christian Gunawan') => {
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').split('.')[0],
      user,
      action,
      details
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleNavigate = (id) => {
    setView(id);
  };

  const handleNavigateToQC = (batchId) => {
    setActiveBatchId(batchId);
    setView('qc');
  };

  // Webhook Handler (Replacing manual batch creation)
  const handleWebhookIngest = (payload) => {
    // 1. Parse Physical Location
    const [building, level, rack, box] = payload.lokasi_fisik.split('/').map(s => s.trim());

    // 2. Create Document Record
    const newDocId = payload.transaction_id;

    const newDoc = {
      id: newDocId,
      title: payload.suggested_category.toUpperCase(),
      status: 'COMPLETED', // Auto-completed as per "Black Box" rule
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      file: `Scan_${newDocId}.jpg`,
      cat: payload.suggested_category,

      // Detailed Data (previously in mockQCData)
      ocrContent: {
        text: payload.ocr_text,
        confidence: payload.confidence_score
      },
      physicalLocation: {
        building, // e.g., "Gedung A"
        level,    // e.g., "Lantai 1"
        rack,     // e.g., "Rak 05"
        box       // e.g., "Box 10"
      },
      history: [
        {
          date: new Date().toISOString(),
          action: 'INGESTED',
          user: 'Akira OCR Webhook',
          details: `Received from ${payload.lokasi_fisik}`
        }
      ]
    };

    // 3. Update State
    // We strictly append to the "Repository" (Batches + Details combined)
    setBatches(prev => [newDoc, ...prev]);

    // Add to detailed lookup as well if we keep using it, or verify if we can merge.
    // For this prototype, we'll try to keep `batches` as the main list source 
    // and inject into mockQCData for the detail view to work without full refactor yet.
    mockQCData[newDocId] = newDoc;

    handleAddLog('WEBHOOK_RECEIVED', `Ingested ${newDocId} into ${box}`, 'Akira Integration');
  };

  // Master Data Handlers
  const handleAddCategory = (cat) => {
    setCategories([...categories, { ...cat, id: `CAT-${Date.now().toString().slice(-3)}` }]);
    handleAddLog('CREATE_CAT', `Created category: ${cat.name}`);
  };

  /* Correcting the syntax error: closing brace for component was missing or misplaced */

  const handleDeleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    handleAddLog('DELETE_CAT', `Deleted category: ${cat ? cat.name : id}`);
  };

  const handleMoveDocument = (docId, newLocation) => {
    setBatches(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          physicalLocation: {
            building: newLocation.building,
            level: newLocation.level,
            rack: newLocation.rack,
            box: newLocation.box
          }
        };
      }
      return doc;
    }));
    handleAddLog('MOVE_DOC', `Moved ${docId} to ${newLocation.building}/${newLocation.box}`);
  };

  const handleNextDoc = () => {
    const currentIndex = batches.findIndex(b => b.id === activeBatchId);
    if (currentIndex < batches.length - 1) {
      setActiveBatchId(batches[currentIndex + 1].id);
    }
  };

  const handlePrevDoc = () => {
    const currentIndex = batches.findIndex(b => b.id === activeBatchId);
    if (currentIndex > 0) {
      setActiveBatchId(batches[currentIndex - 1].id);
    }
  };

  return (
    <>
      <Sidebar activeView={view} onNavigate={handleNavigate} />
      <div className="main-wrapper">
        <Header activeView={view} onBack={() => setView('ingestion')} detailInfo={activeBatchId} />
        <div className="content-area">
          {view === 'ingestion' && (
            <IngestionDashboard
              batches={batches}
              onNavigateToQC={handleNavigateToQC}
              onOpenModal={() => setIsModalOpen(true)}
            />
          )}
          {view === 'drive' && (
            <DriveView
              documents={batches}
              onNavigateToDoc={handleNavigateToQC}
              onMoveDocument={handleMoveDocument}
            />
          )}
          {view === 'qc' && (
            <DataPreviewer
              data={mockQCData[activeBatchId] || {
                // Fallback for demo if id not found in mockQCData but exists in batches
                ...batches.find(b => b.id === activeBatchId),
                ocrContent: batches.find(b => b.id === activeBatchId)?.ocrContent || {},
                physicalLocation: batches.find(b => b.id === activeBatchId)?.physicalLocation || {}
              }}
              onBack={() => setView('drive')}
              onNextDoc={handleNextDoc}
              onPrevDoc={handlePrevDoc}
            />
          )}
          {view === 'audit' && (
            <AuditTrail data={auditLogs} />
          )}
          {view === 'search' && (
            <GlobalSearch onNavigateToDoc={handleNavigateToQC} />
          )}
        </div>
      </div>
      <WebhookSimulator onIngest={handleWebhookIngest} />
    </>
  );
}

export default App;
