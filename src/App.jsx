import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import IngestionDashboard from './components/IngestionDashboard';
import QCWorkspace from './components/QCWorkspace';
import UploadModal from './components/UploadModal';
import MasterData from './components/MasterData';
import AuditTrail from './components/AuditTrail';
import GlobalSearch from './components/GlobalSearch';
import PhysicalLocationMaster from './components/PhysicalLocationMaster';

const initialBatches = [
  { id: "BATCH-001", file: "Scan_Sertifikat_BDG.pdf", cat: "SHM", status: "DRAFT", date: "20 Oct 2025" },
  { id: "BATCH-002", file: "Scan_Akta_Tanah.jpg", cat: "AJB", status: "DRAFT", date: "21 Oct 2025" },
  { id: "BATCH-003", file: "Scan_Warkah_09.pdf", cat: "WARKAH", status: "PROCESSING", date: "22 Oct 2025" }
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

  const handleCreateBatch = (name) => {
    const newBatch = {
      id: "BATCH-NEW",
      file: name + ".pdf",
      cat: "...",
      status: "PROCESSING",
      date: "Just Now"
    };
    setBatches([newBatch, ...batches]);
    handleAddLog('UPLOAD_BATCH', `Created new batch: ${newBatch.id}`, 'Christian Gunawan');
    setIsModalOpen(false);
  };

  const handleApprove = () => {
    alert("Document Metadata Validated & Synced to DMS Core.");
    // Update batch status to success or remove it
    setBatches(batches.map(b => b.id === activeBatchId ? { ...b, status: 'SYNCED' } : b));
    handleAddLog('APPROVE_DOC', `Approved and synced document: ${activeBatchId}`);
    setView('ingestion');
  };

  // Master Data Handlers
  const handleAddCategory = (cat) => {
    setCategories([...categories, { ...cat, id: `CAT-${Date.now().toString().slice(-3)}` }]);
    handleAddLog('CREATE_CAT', `Created category: ${cat.name}`);
  };

  const handleDeleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    handleAddLog('DELETE_CAT', `Deleted category: ${cat ? cat.name : id}`);
  };

  const handleNextBatch = () => {
    const currentIndex = batches.findIndex(b => b.id === activeBatchId);
    if (currentIndex < batches.length - 1) {
      setActiveBatchId(batches[currentIndex + 1].id);
    }
  };

  const handlePrevBatch = () => {
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
          {view === 'qc' && (
            <QCWorkspace
              onApprove={handleApprove}
              data={mockQCData[activeBatchId] || mockQCData["BATCH-001"]}
              onNext={handleNextBatch}
              onPrev={handlePrevBatch}
              hasNext={batches.findIndex(b => b.id === activeBatchId) < batches.length - 1}
              hasPrev={batches.findIndex(b => b.id === activeBatchId) > 0}
              categories={categories}
            />
          )}
          {view === 'master' && (
            <MasterData data={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
          )}
          {view === 'physical' && (
            <PhysicalLocationMaster />
          )}
          {view === 'audit' && (
            <AuditTrail data={auditLogs} />
          )}
          {view === 'search' && (
            <GlobalSearch />
          )}
        </div>
      </div>
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBatch}
      />
    </>
  );
}

export default App;
