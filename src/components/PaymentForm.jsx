// src/components/PaymentForm.jsx

import { useState } from "react";

function PaymentForm({ onAddPayment }) {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 오늘 날짜 기본값

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0 && description.trim()) {
      onAddPayment(amount, description, date);
      setAmount(0);
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
      <form className="payment-form" onSubmit={handleSubmit}>
        <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Amount"
            required
        />
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
        />
        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
        />
        <button type="submit">Add Payment</button>
      </form>
  );
}

export default PaymentForm;
