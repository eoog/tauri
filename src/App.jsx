// src/App.jsx

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import PaymentForm from "./components/PaymentForm";
import PaymentList from "./components/PaymentList";
import "./App.css";

function App() {
  const [payments, setPayments] = useState([]);

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

  return (
      <main className="container">
        <h1>Kiosk Payment Management</h1>
        <PaymentForm onAddPayment={handleAddPayment} />
        <PaymentList payments={payments} onDeletePayment={handleDeletePayment} />
      </main>
  );
}

export default App;
