import React, { useState } from 'react';
import FolderManagementModal from './FolderManagementModal';
import MoveDocumentModal from './MoveDocumentModal';

const DriveView = ({ documents = [], onNavigateToDoc, onMoveDocument }) => {
    const [currentPath, setCurrentPath] = useState([]); // Array of folder names
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [moveTargetDoc, setMoveTargetDoc] = useState(null);

    // Mock state for "Empty" folders that are manually added
    const [manualFolders, setManualFolders] = useState([]);

    // Define the rigid hierarchy levels
    const STRUCTURE_LEVELS = ['ROOT', 'BUILDING', 'LEVEL', 'RACK', 'BOX'];

    const getFolderContents = () => {
        // Safety check
        if (!Array.isArray(documents)) return { type: 'DOCUMENTS', items: [] };

        // Group documents based on current depth
        const depth = currentPath.length;
        const currentLevelType = STRUCTURE_LEVELS[depth + 1]; // What we are looking for next

        if (!currentLevelType) {
            // We are inside a Box, show documents
            const boxDocs = documents.filter(doc => {
                if (!doc.physicalLocation) return false;
                const docPath = [
                    doc.physicalLocation.building,
                    doc.physicalLocation.level,
                    doc.physicalLocation.rack,
                    doc.physicalLocation.box
                ];
                return JSON.stringify(docPath) === JSON.stringify(currentPath);
            });
            return { type: 'DOCUMENTS', items: boxDocs };
        }

        // We are navigating folders. Find unique values for the next level.
        const nextFolders = new Set();

        documents.forEach(doc => {
            if (!doc.physicalLocation) return;
            const docPath = [
                doc.physicalLocation.building,
                doc.physicalLocation.level,
                doc.physicalLocation.rack,
                doc.physicalLocation.box
            ];

            // Check if doc belongs in current path
            const matchesPath = currentPath.every((val, index) => docPath[index] === val);

            if (matchesPath) {
                const folderName = docPath[depth];
                if (folderName) nextFolders.add(folderName);
            }
        });

        // Add Manual Folders that match current path
        manualFolders.forEach(mf => {
            // mf has { type: 'BUILDING', name: 'Gedung Z' }
            if (depth === 0 && mf.type === 'BUILDING') nextFolders.add(mf.name);
        });

        return { type: 'FOLDERS', items: Array.from(nextFolders).sort() };
    };

    const handleAddFolder = (type, name) => {
        setManualFolders([...manualFolders, { type, name }]);
        setIsManagerOpen(false);
    };

    const handleDeleteFolder = (type, name) => {
        setManualFolders(manualFolders.filter(f => !(f.type === type && f.name === name)));
    };

    // DEBUG LOG
    // console.log('DriveView Render', { currentPath, docCount: documents?.length });

    const { type, items } = getFolderContents();

    const handleFolderClick = (folderName) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleBreadcrumbClick = (index) => {
        setCurrentPath(currentPath.slice(0, index));
    };

    const getIconForType = (levelType) => {
        switch (levelType) {
            case 'BUILDING': return '🏢';
            case 'LEVEL': return '🪜';
            case 'RACK': return '🗄️';
            case 'BOX': return '📦';
            default: return '📁';
        }
    };

    return (
        <div style={{ padding: '20px', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Digital Archive</h2>
                <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={() => setIsManagerOpen(true)}>
                    ⚙️ Manage Folders (Admin)
                </button>
            </div>

            {/* Breadcrumb */}
            <div style={{
                background: '#F9FAFB',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#6B7280'
            }}>
                <span
                    style={{ cursor: 'pointer', color: currentPath.length === 0 ? '#111827' : '#2563EB' }}
                    onClick={() => setCurrentPath([])}
                >
                    Archive Home
                </span>
                {currentPath.map((folder, index) => (
                    <React.Fragment key={index}>
                        <span>/</span>
                        <span
                            style={{
                                cursor: 'pointer',
                                color: index === currentPath.length - 1 ? '#111827' : '#2563EB',
                                fontWeight: index === currentPath.length - 1 ? 600 : 400
                            }}
                            onClick={() => handleBreadcrumbClick(index + 1)}
                        >
                            {folder}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* Content Area */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px'
            }}>
                {type === 'FOLDERS' && items.map(folder => (
                    <div
                        key={folder}
                        onClick={() => handleFolderClick(folder)}
                        style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            padding: '24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'white',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#2563EB'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                    >
                        <div style={{ fontSize: '32px' }}>
                            {getIconForType(STRUCTURE_LEVELS[currentPath.length + 1])}
                        </div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#1F2937' }}>{folder}</div>
                    </div>
                ))}

                {type === 'DOCUMENTS' && items.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => onNavigateToDoc(doc.id)}
                        style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                            background: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#2563EB'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                    >
                        <div style={{
                            height: '100px',
                            background: '#F3F4F6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9CA3AF',
                            fontSize: '24px'
                        }}>
                            📄
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.file}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                {doc.date}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{
                                    fontSize: '10px',
                                    background: '#DEF7EC',
                                    color: '#03543F',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    width: 'fit-content'
                                }}>
                                    {doc.cat}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMoveTargetDoc(doc.id); }}
                                    style={{ border: 'none', background: '#EFF6FF', color: '#2563EB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}
                                    title="Move Document"
                                >
                                    ➡️ Move
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                        No items found in this location.
                    </div>
                )}
            </div>

            {/* Modals Restored */}
            <FolderManagementModal
                isOpen={isManagerOpen}
                onClose={() => setIsManagerOpen(false)}
                onAddFolder={handleAddFolder}
                onDeleteFolder={handleDeleteFolder}
                documents={documents}
                manualFolders={manualFolders}
            />

            <MoveDocumentModal
                isOpen={!!moveTargetDoc}
                docId={moveTargetDoc}
                onClose={() => setMoveTargetDoc(null)}
                onMove={onMoveDocument}
            />
        </div>
    );
};

export default DriveView;
