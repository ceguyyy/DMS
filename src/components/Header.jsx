import React from 'react';

const Header = ({ activeView, onBack, detailInfo }) => {
    // Logic to determine titles based on view
    const isQC = activeView === 'qc';
    const breadcrumb = isQC ? 'Ingestion / QC Workspace' : 'Module / Ingestion';
    const pageTitle = isQC ? `Document QC: ${detailInfo || '#----'}` : 'Ingestion Dashboard';

    return (
        <div className="header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isQC && (
                    <span className="back-link" onClick={onBack}>←</span>
                )}
                <div>
                    <div className="breadcrumb">{breadcrumb}</div>
                    <div className="page-title">{pageTitle}</div>
                </div>
            </div>
            <div className="user-profile">
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>Christian Gunawan</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>System Administrator</div>
                </div>
                <div className="avatar">CG</div>
            </div>
        </div>
    );
};

export default Header;
