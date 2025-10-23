// src/App.jsx

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import PaymentForm from "./components/PaymentForm";
import PaymentList from "./components/PaymentList";
import BottomTabs from "./components/BottomTabs";
import Settings from "./components/Settings";
import "./App.css";
import Titlebar                from "./components/Titlebar.jsx";

function App() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('payments');
  const [isLoading, setIsLoading] = useState(true);
  const [db, setDb] = useState(null);

  // 데이터베이스 초기화
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = await Database.load("sqlite:payments.db");
        setDb(database);
        console.log("Database connected successfully");
      } catch (error) {
        console.error("Failed to connect to database:", error);
      }
    };

    initDatabase();
  }, []);


  const showDbPath = async () => {
    try {
      const path = await invoke("get_db_path");
      alert(path); // 팝업으로 경로 표시
      console.log(path);
    } catch (error) {
      console.error("Failed to get path:", error);
    }
  };

// 컴포넌트에서 호출
  useEffect(() => {
    showDbPath();
  }, []);

  const fetchPayments = async () => {
    if (!db) return;

    try {
      setIsLoading(true);
      const fetchedPayments = await db.select(
          "SELECT id, amount, description, date, created_at FROM payments ORDER BY created_at DESC"
      );
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터베이스가 연결되면 결제 목록 가져오기
  useEffect(() => {
    if (db) {
      fetchPayments();
    }
  }, [db]);

  const handleAddPayment = async (amount, description, date) => {
    if (!db) {
      alert("Database not connected");
      return;
    }

    try {
      // 먼저 백엔드에서 검증
      await invoke("add_payment", { amount, description, date });

      // 검증 통과하면 데이터베이스에 삽입
      const result = await db.execute(
          "INSERT INTO payments (amount, description, date) VALUES ($1, $2, $3)",
          [amount, description, date]
      );

      console.log("Payment added with ID:", result.lastInsertId);

      // 목록 새로고침
      fetchPayments();
    } catch (error) {
      console.error("Failed to add payment:", error);
      alert("Failed to add payment: " + error);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!db) {
      alert("Database not connected");
      return;
    }

    try {
      // 먼저 백엔드에서 검증
      await invoke("delete_payment", { id: parseInt(id) });

      // 검증 통과하면 데이터베이스에서 삭제
      const result = await db.execute(
          "DELETE FROM payments WHERE id = $1",
          [parseInt(id)]
      );

      if (result.rowsAffected > 0) {
        // 로컬 상태에서도 제거
        setPayments(payments.filter(payment => payment.id !== parseInt(id)));
        console.log("Payment deleted successfully");
      } else {
        alert("Payment not found");
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);
      alert("Failed to delete payment: " + error);
    }
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'add':
        return 'Add Payment';
      case 'payments':
        return 'Payment History';
      case 'settings':
        return 'Settings';
      default:
        return 'Kiosk Payment Management';
    }
  };

  const renderContent = () => {
    if (isLoading && activeTab === 'payments') {
      return (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading payments...</p>
          </div>
      );
    }

    switch(activeTab) {
      case 'add':
        return (
            <div className="content-wrapper fade-in">
              <PaymentForm onAddPayment={handleAddPayment} />
            </div>
        );
      case 'payments':
        return (
            <div className="content-wrapper fade-in">
              <PaymentList payments={payments} onDeletePayment={handleDeletePayment} />
            </div>
        );
      case 'settings':
        return (
            <div className="content-wrapper fade-in">
              <Settings />
            </div>
        );
      default:
        return (
            <div className="content-wrapper fade-in">
              <PaymentList payments={payments} onDeletePayment={handleDeletePayment} />
            </div>
        );
    }
  };

  return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-background"></div>
          <div className="header-content">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
                <path d="M7 15H9V17H7V15Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="header-title">{getTabTitle()}</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-container">
            {renderContent()}
          </div>
        </main>

        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
  );
}

export default App;
