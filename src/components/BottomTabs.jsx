// src/components/BottomTabs.jsx

import React from 'react';
import './BottomTabs.css';

const BottomTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'payments', label: '결제 내역', icon: '💳' },
    { id: 'add', label: '결제 추가', icon: '➕' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ];

  return (
      <div className="bottom-tabs">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
        ))}
      </div>
  );
};

export default BottomTabs;
