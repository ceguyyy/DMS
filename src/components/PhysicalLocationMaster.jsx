import React, { useState, useRef, useEffect } from 'react';

const PhysicalLocationMaster = () => {
    // Mock Data
    const [locations, setLocations] = useState([
        { id: 'LOC-001', name: 'Gedung A', type: 'BUILDING', parentId: null, description: 'Main HQ' },
        { id: 'LOC-002', name: 'Lantai 1', type: 'LEVEL', parentId: 'LOC-001', description: 'Ground Floor' },
        { id: 'LOC-003', name: 'Ruang Arsip 101', type: 'ROOM', parentId: 'LOC-002', description: 'Secure Archive' },
        { id: 'LOC-004', name: 'Rak A-01', type: 'RACK', parentId: 'LOC-003', description: 'Metal Rack' },
        { id: 'LOC-005', name: 'Box 2023-A', type: 'BOX', parentId: 'LOC-004', description: 'Documents 2023' }
    ]);

    // Navigation State
    const [breadcrumbs, setBreadcrumbs] = useState([]); // Array of location objects
    const [viewMode, setViewMode] = useState('list');   // 'list' | 'create' | 'edit'
    const [editingItem, setEditingItem] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'sublocations'

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [activeFilters, setActiveFilters] = useState(null);
    const filterRef = useRef(null);

    // Close filter on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Derived State
    const currentParent = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

    // Filter Logic
    const currentChildren = locations.filter(l => {
        const matchesParent = l.parentId === (currentParent ? currentParent.id : null);
        if (!matchesParent) return false;

        if (activeFilters) {
            const itemValue = l[activeFilters.column]?.toString().toLowerCase() || '';
            return itemValue.includes(activeFilters.value.toLowerCase());
        }
        return true;
    });

    // Determine next type based on current level
    const getNextType = () => {
        if (!currentParent) return 'BUILDING';
        const map = { 'BUILDING': 'LEVEL', 'LEVEL': 'ROOM', 'ROOM': 'RACK', 'RACK': 'BOX' };
        return map[currentParent.type] || 'BOX';
    };

    // Handlers
    const handleDrillDown = (loc) => {
        if (loc.type === 'BOX') return; // Cannot drill into box
        setBreadcrumbs([...breadcrumbs, loc]);
        setActiveTab('details'); // Default to details so user chooses tab
    };

    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            setBreadcrumbs([]);
        } else {
            setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        }
    };

    const handleApplyFilter = () => {
        if (filterColumn && filterValue) {
            setActiveFilters({ column: filterColumn, value: filterValue });
            setIsFilterOpen(false);
        }
    };

    const handleResetFilter = () => {
        setFilterColumn('');
        setFilterValue('');
        setActiveFilters(null);
        setIsFilterOpen(false);
    };

    const handleSave = (item) => {
        if (viewMode === 'create') {
            const newItem = {
                id: `LOC-${Date.now().toString().slice(-4)}`,
                parentId: currentParent ? currentParent.id : null,
                type: item.type || getNextType(), // Ensure type is set
                ...item
            };
            setLocations([...locations, newItem]);
        } else if (viewMode === 'edit') {
            setLocations(locations.map(l => l.id === item.id ? item : l));
        }
        setViewMode('list');
        setEditingItem(null);
    };

    const handleDelete = (id) => {
        const hasChildren = locations.some(l => l.parentId === id);
        if (hasChildren) {
            alert("Cannot delete. This location has items inside. Delete them first.");
            return;
        }
        if (confirm("Delete this location?")) {
            setLocations(locations.filter(l => l.id !== id));
        }
    };

    const pluralizeType = (type) => {
        if (!type) return '';
        // Using singular here based on "choose tab Level" requirement, or keeping plural but label handles it?
        // User asked for "tab level", implying singular or just the type name.
        // Let's just return the type properly capitalized for display
        return type.charAt(0) + type.slice(1).toLowerCase();
    };

    const renderFilter = () => (
        <div style={{ position: 'relative' }} ref={filterRef}>
            <button
                className="btn btn-outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{
                    background: activeFilters ? '#EFF6FF' : 'white',
                    borderColor: activeFilters ? 'var(--primary)' : 'var(--input-border)',
                    color: activeFilters ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex', alignItems: 'center', gap: '6px'
                }}
            >
                <i className="icon-filter" style={{ fontStyle: 'normal' }}>Filter</i> {activeFilters ? '(Active)' : ''}
            </button>

            {isFilterOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                    background: 'white', border: '1px solid var(--border)', borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '300px', padding: '16px', zIndex: 10
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Filter by</label>
                        <select
                            className="form-input"
                            value={filterColumn}
                            onChange={(e) => setFilterColumn(e.target.value)}
                        >
                            <option value="" disabled>Select column</option>
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                            <option value="type">Type</option>
                            <option value="description">Description</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Filter value</label>
                        <input
                            type="text"
                            className="form-input" placeholder="Enter value"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="btn" style={{ color: 'var(--text-sub)' }} onClick={handleResetFilter}>Reset</button>
                        <button className="btn btn-primary" onClick={handleApplyFilter}>Apply</button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: '0 20px', maxWidth: '1000px' }}>
            {/* Header / Breadcrumbs */}
            <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span
                        style={{ cursor: 'pointer', color: breadcrumbs.length === 0 ? 'var(--text-main)' : 'var(--primary)', fontWeight: breadcrumbs.length === 0 ? 700 : 500 }}
                        onClick={() => handleBreadcrumbClick(-1)}
                    >
                        Physical Location
                    </span>
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={crumb.id}>
                            <span style={{ color: 'var(--text-sub)' }}>/</span>
                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: idx === breadcrumbs.length - 1 ? 'var(--text-main)' : 'var(--primary)',
                                    fontWeight: idx === breadcrumbs.length - 1 ? 700 : 500
                                }}
                                onClick={() => handleBreadcrumbClick(idx)}
                            >
                                {crumb.name}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* List View with Tabs (if parent exists) */}
            {viewMode === 'list' && (
                <div>
                    {currentParent && (
                        <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '24px' }}>
                            <button
                                style={{
                                    background: 'none', border: 'none', padding: '0 0 12px 0',
                                    fontSize: '14px', fontWeight: 600,
                                    color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-sub)',
                                    borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('details')}
                            >
                                Location Details
                            </button>
                            <button
                                style={{
                                    background: 'none', border: 'none', padding: '0 0 12px 0',
                                    fontSize: '14px', fontWeight: 600,
                                    color: activeTab === 'sublocations' ? 'var(--primary)' : 'var(--text-sub)',
                                    borderBottom: activeTab === 'sublocations' ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('sublocations')}
                            >
                                {pluralizeType(getNextType())}
                            </button>
                        </div>
                    )}

                    {/* Sub-locations Tab Content (Or Root View) */}
                    {(activeTab === 'sublocations' || !currentParent) && (
                        <>
                            {/* Toolbar: Filter and Add Button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                {renderFilter()}

                                {(!currentParent || currentParent.type !== 'BOX') && (
                                    <button
                                        className="btn"
                                        style={{ background: '#111827', color: 'white', fontWeight: 600 }}
                                        onClick={() => { setEditingItem({}); setViewMode('create'); }}
                                    >
                                        + Add {getNextType()}
                                    </button>
                                )}
                            </div>

                            {currentChildren.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sub)', background: '#F9FAFB', borderRadius: '8px' }}>
                                    No items found here. Press "Add" to create a {getNextType()}.
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description / ID</th>
                                                <th>Type</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentChildren.map(loc => (
                                                <tr
                                                    key={loc.id}
                                                    style={{ cursor: loc.type !== 'BOX' ? 'pointer' : 'default' }}
                                                    onClick={() => handleDrillDown(loc)}
                                                    className="hover-row"
                                                >
                                                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                                        {loc.name}
                                                    </td>
                                                    <td style={{ color: 'var(--text-main)' }}>
                                                        {loc.description || loc.id}
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: '10px', fontWeight: 700, background: '#E0E7FF', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>
                                                            {loc.type}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button
                                                            className="btn"
                                                            style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--text-sub)' }}
                                                            onClick={(e) => { e.stopPropagation(); setEditingItem(loc); setViewMode('edit'); }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn"
                                                            style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--danger)', marginLeft: '8px' }}
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {/* Details Tab Content */}
                    {activeTab === 'details' && currentParent && (
                        <ParentDetailsForm
                            key={currentParent.id}
                            item={currentParent}
                            onUpdate={(updatedItem) => {
                                const newName = updatedItem.name;
                                // Update locations list
                                setLocations(locations.map(l => l.id === updatedItem.id ? updatedItem : l));
                                // Update breadcrumbs if name changed
                                setBreadcrumbs(breadcrumbs.map(b => b.id === updatedItem.id ? { ...b, name: newName } : b));
                            }}
                        />
                    )}

                    <style>{`
                        .hover-row:hover { background-color: #F9FAFB; }
                    `}</style>
                </div>
            )}

            {/* Create/Edit Form */}
            {(viewMode === 'create' || viewMode === 'edit') && (
                <LocationForm
                    mode={viewMode}
                    item={editingItem}
                    parentType={currentParent ? currentParent.type : null}
                    childType={viewMode === 'create' ? getNextType() : editingItem.type}
                    onSave={handleSave}
                    onCancel={() => { setViewMode('list'); setEditingItem(null); }}
                />
            )}
        </div>
    );
};

// Sub-component for the Details Tab Form
const ParentDetailsForm = ({ item, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: item.name,
        description: item.description,
        type: item.type,
        id: item.id
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ background: 'white', padding: '0', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Name</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Type</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.type}
                    readOnly
                    style={{ width: '100%', background: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>ID <span style={{ color: 'red' }}>*</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.id}
                    readOnly
                    style={{ width: '100%', background: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Description</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary"
                    style={{ padding: '8px 24px' }}
                    onClick={() => onUpdate({ ...item, ...formData })}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

// Sub-component for the Form
const LocationForm = ({ mode, item, parentType, childType, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        description: item?.description || ''
    });

    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', maxWidth: '600px' }}>
            <h3 style={{ marginTop: 0 }}>{mode === 'create' ? `Add New ${childType}` : 'Edit Location'}</h3>

            <div className="form-group">
                <label className="form-label">{childType} Name</label>
                <input
                    type="text" className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={`e.g. ${childType} A-01`}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Description / IDs</label>
                <input
                    type="text" className="form-input"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Storage for 2024 documents"
                />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-primary" onClick={() => onSave({ ...item, ...formData })}>
                    {mode === 'create' ? 'Create' : 'Update'}
                </button>
                <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default PhysicalLocationMaster;
