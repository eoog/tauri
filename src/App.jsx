// src/App.jsx

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import PaymentForm from "./components/PaymentForm";
import PaymentList from "./components/PaymentList";
import BottomTabs from "./components/BottomTabs";
import Settings from "./components/Settings"; // 새로 추가할 설정 페이지
import "./App.css";

function App() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('payments');

  const fetchPayments = async () => {
    const fetchedPayments = await invoke("get_payments");
    setPayments(fetchedPayments);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAddPayment = async (amount, description, date) => {
    await invoke("add_payment", { amount, description, date });
    fetchPayments();
  };

  const handleDeletePayment = async (id) => {
    await invoke("delete_payment", { id });
    fetchPayments();
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'add':
        return <PaymentForm onAddPayment={handleAddPayment} />;
      case 'payments':
        return <PaymentList payments={payments} onDeletePayment={handleDeletePayment} />;
      case 'settings':
        return <Settings />;
      default:
        return <PaymentList payments={payments} onDeletePayment={handleDeletePayment} />;
    }
  };

  return (
      <div className="app-container">
        <main className="container">
          <h1>Kiosk Payment Management</h1>
          <div className="content">
            {renderContent()}
          </div>
        </main>
        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
  );
}

export default App;
