// src/App.jsx

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import PaymentForm from "./components/PaymentForm";
import PaymentList from "./components/PaymentList";
import BottomTabs from "./components/BottomTabs";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('payments');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const fetchedPayments = await invoke("get_payments");
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAddPayment = async (amount, description, date) => {
    try {
      await invoke("add_payment", { amount, description, date });
      fetchPayments();
    } catch (error) {
      console.error("Failed to add payment:", error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await invoke("delete_payment", { id });
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
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
