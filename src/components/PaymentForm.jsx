import { useState } from "react";

function PaymentForm({ onAddPayment }) {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 오늘 날짜 기본값
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px'
    },
    form: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      border: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '24px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      borderRadius: '10px',
      border: '2px solid #e5e7eb',
      backgroundColor: '#fafafa',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    inputFocus: {
      borderColor: '#3b82f6',
      backgroundColor: 'white',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 20px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    submitButtonHover: {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
    },
    submitButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    formRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px'
    },
    formColumn: {
      flex: 1
    }
  };

  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount > 0 && description.trim()) {
      setIsSubmitting(true);
      try {
        await onAddPayment(amount, description, date);
        setAmount(0);
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
      } catch (error) {
        console.error('Failed to add payment:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputStyle = (inputName) => ({
    ...styles.input,
    ...(focusedInput === inputName ? styles.inputFocus : {})
  });

  const getButtonStyle = () => ({
    ...styles.submitButton,
    ...(hoveredButton && !isSubmitting ? styles.submitButtonHover : {}),
    ...(isSubmitting ? styles.submitButtonDisabled : {})
  });

  return (
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.title}>
            💰 새 결제 추가
          </h2>

          <div style={styles.formRow}>
            <div style={styles.formColumn}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>금액 💵</label>
                <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    style={getInputStyle('amount')}
                    onFocus={() => setFocusedInput('amount')}
                    onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            <div style={styles.formColumn}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>날짜 📅</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={getInputStyle('date')}
                    onFocus={() => setFocusedInput('date')}
                    onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>설명 📝</label>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="결제 내용을 입력하세요..."
                required
                style={getInputStyle('description')}
                onFocus={() => setFocusedInput('description')}
                onBlur={() => setFocusedInput(null)}
            />
          </div>

          <button
              type="submit"
              disabled={isSubmitting}
              style={getButtonStyle()}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
          >
            {isSubmitting ? (
                <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
                  처리 중...
                </>
            ) : (
                <>
                  ✅ 결제 추가
                </>
            )}
          </button>

          <style>
            {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
          </style>
        </form>
      </div>
  );
}

export default PaymentForm;
