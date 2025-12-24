import React, { useState } from 'react';

const Sidebar = ({ activeView, onNavigate }) => {
    // State to track which sections are collapsed
    const [collapsedSections, setCollapsedSections] = useState({
        "Modules": false,         // Default: Expanded
        "Master Data": false      // Default: Expanded to show Category
    });

    const menuStructure = [
        {
            label: "", // Empty label for top-level appearance
            items: [
                { id: "search", label: "Global Search" }
            ]
        },
        {
            label: "Modules",
            isCollapsible: true,
            items: [
                { id: "drive", label: "Digital Archive" },
                { id: "ingestion", label: "Ingestion Monitor" },
                { id: "audit", label: "Audit Trail" }
            ]
        }
    ];

    const toggleSection = (label) => {
        setCollapsedSections(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <div className="sidebar" id="sidebar">
            <div className="brand-section">
                <div className="brand-text">DOCUMENT<br />MANAGEMENT SYSTEM</div>
            </div>

            {menuStructure.map((section, idx) => {
                const isCollapsed = collapsedSections[section.label];
                const canCollapse = section.isCollapsible;

                return (
                    <React.Fragment key={idx}>
                        <div
                            className="nav-section-label"
                            style={{ cursor: canCollapse ? 'pointer' : 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => canCollapse && toggleSection(section.label)}
                        >
                            {section.label}
                            {canCollapse && (
                                <span style={{ fontSize: '10px' }}>
                                    {isCollapsed ? '►' : '▼'}
                                </span>
                            )}
                        </div>

                        {!isCollapsed && section.items.map(item => (
                            <div
                                key={item.id}
                                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                                id={`nav-${item.id}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Sidebar;
