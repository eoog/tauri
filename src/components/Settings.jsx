// src/components/Settings.jsx

import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";
import './Settings.css';

const Settings = () => {
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [autoBackup, setAutoBackup] = useState(true);
  const [currency, setCurrency] = useState('KRW');
  const [theme, setTheme] = useState('light');

  const handleClearData = async () => {
    const confirmClear = window.confirm('모든 결제 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');

    if (confirmClear) {
      try {
        // 백엔드에 모든 데이터 삭제 요청 (구현 필요)
        // await invoke("clear_all_payments");
        alert('데이터가 삭제되었습니다.');
      } catch (error) {
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleExportData = async () => {
    try {
      // 데이터 내보내기 기능 (구현 필요)
      // await invoke("export_payments");
      alert('데이터 내보내기가 완료되었습니다.');
    } catch (error) {
      alert('데이터 내보내기 중 오류가 발생했습니다.');
    }
  };

  const handleBackup = async () => {
    try {
      // 백업 기능 (구현 필요)
      // await invoke("backup_data");
      alert('백업이 완료되었습니다.');
    } catch (error) {
      alert('백업 중 오류가 발생했습니다.');
    }
  };

  return (
      <div className="settings-container">
        <div className="settings-section">
          <h2>앱 정보</h2>
          <div className="setting-item">
            <span className="setting-label">버전</span>
            <span className="setting-value">{appVersion}</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>일반 설정</h2>

          <div className="setting-item">
            <span className="setting-label">통화</span>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="setting-select"
            >
              <option value="KRW">원 (KRW)</option>
              <option value="USD">달러 (USD)</option>
              <option value="EUR">유로 (EUR)</option>
              <option value="JPY">엔 (JPY)</option>
            </select>
          </div>

          <div className="setting-item">
            <span className="setting-label">테마</span>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="setting-select"
            >
              <option value="light">라이트</option>
              <option value="dark">다크</option>
              <option value="auto">시스템 설정</option>
            </select>
          </div>

          <div className="setting-item">
            <span className="setting-label">자동 백업</span>
            <label className="setting-toggle">
              <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>데이터 관리</h2>

          <button className="setting-button primary" onClick={handleBackup}>
            <span className="button-icon">💾</span>
            데이터 백업
          </button>

          <button className="setting-button secondary" onClick={handleExportData}>
            <span className="button-icon">📤</span>
            데이터 내보내기
          </button>

          <button className="setting-button danger" onClick={handleClearData}>
            <span className="button-icon">🗑️</span>
            모든 데이터 삭제
          </button>
        </div>

        <div className="settings-section">
          <h2>정보</h2>
          <div className="info-text">
            <p>Kiosk Payment Management v{appVersion}</p>
            <p>© 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
  );
};

export default Settings;
