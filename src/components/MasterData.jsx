import React, { useState, useRef, useEffect } from 'react';

const MasterData = ({ data, onAdd, onDelete }) => {
    // const [categories, setCategories] = useState([ ... ]); // Moved to App.jsx

    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', code: '', folder: 'C://' });
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    const handleSave = () => {
        if (!newCat.name || !newCat.code) return;
        onAdd(newCat);
        setNewCat({ name: '', code: '', folder: 'C://' });
        setIsAdding(false);
    };

    const handleDeleteClick = (id) => {
        // Mock Dependency Check (BR-004)
        if (id === 'CAT-001') {
            alert("Error: Cannot delete category 'SHM' because it is assigned to 45 active documents. Please reassign them first.");
            return;
        }
        if (confirm('Are you sure you want to delete this category?')) {
            onDelete(id);
        }
    };

    // Filter Logic
    const filteredCategories = data.filter(cat => {
        if (!activeFilters) return true;
        const itemValue = cat[activeFilters.column]?.toString().toLowerCase() || '';
        return itemValue.includes(activeFilters.value.toLowerCase());
    });

    return (
        <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Category Management</h2>
                    <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '4px' }}>Manage document classifications and DMS routing paths.</p>
                </div>
                {!isAdding && (
                    <div style={{ display: 'flex', gap: '12px' }}>
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
                                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
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
                                            <option value="id">ID</option>
                                            <option value="name">Category Name</option>
                                            <option value="code">Code</option>
                                            <option value="folder">Target Folder</option>
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
                        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                            + Add Category
                        </button>
                    </div>
                )}
            </div>

            {isAdding && (
                <div style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '16px' }}>New Category</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label className="form-label">Category Name</label>
                            <input
                                type="text" className="form-input" placeholder="e.g. Tax Report"
                                value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Unique Code</label>
                            <input
                                type="text" className="form-input" placeholder="e.g. TAX"
                                value={newCat.code} onChange={e => setNewCat({ ...newCat, code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Target Folder Path</label>
                            <input
                                type="text" className="form-input" placeholder="e.g. /finance/tax"
                                value={newCat.folder} onChange={e => setNewCat({ ...newCat, folder: e.target.value })}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={handleSave}>Save Category</button>
                        <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {!isAdding && (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Code</th>
                                <th>Target DMS Folder</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length > 0 ? filteredCategories.map(cat => (
                                <tr
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{ cursor: 'pointer' }}
                                    className="table-row-hover"
                                >
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-sub)' }}>{cat.id}</td>
                                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                                    <td><span style={{ background: '#E0E7FF', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{cat.code}</span></td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{cat.folder}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            style={{ color: 'var(--danger)', padding: '4px' }}
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(cat.id); }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCategory && (
                <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0 }}>Category Details</h3>
                        <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Category ID</label>
                                <div style={{ fontFamily: 'monospace' }}>{selectedCategory.id}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Name</label>
                                <div>{selectedCategory.name}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Unique Code</label>
                                <div><span style={{ background: '#E0E7FF', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{selectedCategory.code}</span></div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Target DMS Folder</label>
                                <div style={{ fontFamily: 'monospace', background: '#F9FAFB', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                    {selectedCategory.folder}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--input-border)' }} onClick={() => { handleDeleteClick(selectedCategory.id); setSelectedCategory(null); }}>Delete Category</button>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterData;
