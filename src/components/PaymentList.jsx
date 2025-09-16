// src/components/PaymentList.jsx

function PaymentList({ payments, onDeletePayment }) {
  return (
      <div className="payment-list">
        <h2>Payment History</h2>
        {payments.length === 0 ? (
            <p>No payments yet.</p>
        ) : (
            <ul>
              {payments.map((payment) => (
                  <li key={payment.id}>
              <span>
                {payment.date} - {payment.description}: ${payment.amount}
              </span>
                    <button onClick={() => onDeletePayment(payment.id)}>Delete</button>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

export default PaymentList;
