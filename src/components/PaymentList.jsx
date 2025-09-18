import React, { useState, useEffect } from 'react';

function PaymentList({ payments, onDeletePayment }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isTablet, setIsTablet] = useState(false);

  // 태블릿 모드 감지
  useEffect(() => {
    const checkTabletMode = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 1024);
    };

    checkTabletMode();
    window.addEventListener('resize', checkTabletMode);
    return () => window.removeEventListener('resize', checkTabletMode);
  }, []);

  const getResponsivePadding = (basePadding) => {
    if (isTablet) {
      return basePadding.split(' ').map(value => {
        const num = parseInt(value.replace('px', ''));
        return `${Math.max(num * 1.5, num + 8)}px`;
      }).join(' ');
    }
    return basePadding;
  };

  const styles = {
    emptyState: {
      textAlign: 'center',
      padding: isTablet ? '60px 32px' : '40px 20px',
      color: '#666'
    },
    emptyIcon: {
      width: isTablet ? '80px' : '60px',
      height: isTablet ? '80px' : '60px',
      backgroundColor: '#f0f0f0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: isTablet ? '32px' : '24px'
    },
    paymentItem: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: isTablet ? '12px' : '8px',
      padding: isTablet ? '24px 20px' : '16px',
      marginBottom: isTablet ? '16px' : '12px',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      minHeight: isTablet ? '80px' : '64px',
      overflow: 'hidden'
    },
    paymentItemHover: {
      backgroundColor: '#e9ecef',
      borderColor: '#dee2e6'
    },
    paymentLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: isTablet ? '20px' : '16px',
      flex: 1
    },
    paymentNumber: {
      width: isTablet ? '44px' : '32px',
      height: isTablet ? '44px' : '32px',
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isTablet ? '16px' : '12px',
      fontWeight: 'bold'
    },
    paymentInfo: {
      flex: 1
    },
    paymentDescription: {
      fontSize: isTablet ? '20px' : '16px',
      fontWeight: '500',
      color: '#333',
      margin: `0 0 ${isTablet ? '6px' : '4px'} 0`
    },
    paymentDate: {
      fontSize: isTablet ? '16px' : '14px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: isTablet ? '6px' : '4px'
    },
    paymentRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: isTablet ? '16px' : '12px',
      flexShrink: 0,
      minWidth: isTablet ? '140px' : '100px',
      maxWidth: isTablet ? '200px' : '150px'
    },
    paymentAmount: {
      fontSize: isTablet ? '18px' : '16px',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'right',
      wordBreak: 'break-all',
      lineHeight: '1.3',
      maxWidth: '100%',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: isTablet ? '8px' : '6px',
      padding: isTablet ? '10px 14px' : '8px 12px',
      cursor: 'pointer',
      fontSize: isTablet ? '13px' : '12px',
      transition: 'background-color 0.2s ease',
      opacity: 0.7,
      whiteSpace: 'nowrap',
      flexShrink: 0
    },
    deleteButtonHover: {
      backgroundColor: '#c82333',
      opacity: 1
    },
    footer: {
      backgroundColor: '#f8f9fa',
      padding: isTablet ? '24px 20px' : '16px 20px',
      borderTop: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: isTablet ? '16px' : '8px'
    },
    footerText: {
      fontSize: isTablet ? '16px' : '14px',
      color: '#666'
    },
    footerTotal: {
      fontSize: isTablet ? '16px' : '14px',
      fontWeight: '600',
      color: '#333'
    }
  };

  return (
      <div>
        {payments.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💳</div>
              <p style={{
                fontSize: isTablet ? '22px' : '18px',
                margin: '0 0 8px 0'
              }}>
                결제 내역이 없습니다
              </p>
              <p style={{
                fontSize: isTablet ? '16px' : '14px',
                margin: 0,
                color: '#999'
              }}>
                첫 번째 결제를 추가해보세요
              </p>
            </div>
        ) : (
            <>
              {payments.map((payment, index) => (
                  <div
                      key={payment.id}
                      style={{
                        ...styles.paymentItem,
                        ...(hoveredItem === payment.id ? styles.paymentItemHover : {})
                      }}
                      onMouseEnter={() => setHoveredItem(payment.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={styles.paymentLeft}>
                      <div style={styles.paymentNumber}>
                        #{index + 1}
                      </div>
                      <div style={styles.paymentInfo}>
                        <h3 style={styles.paymentDescription}>
                          {payment.description}
                        </h3>
                        <div style={styles.paymentDate}>
                          📅 {payment.date}
                        </div>
                      </div>
                    </div>

                    <div style={styles.paymentRight}>
                      <div style={styles.paymentAmount}>
                        ${typeof payment.amount === 'number'
                          ? payment.amount.toLocaleString()
                          : parseFloat(payment.amount).toLocaleString()}
                      </div>

                      <button
                          onClick={() => onDeletePayment(payment.id)}
                          style={{
                            ...styles.deleteButton,
                            ...(hoveredButton === payment.id ? styles.deleteButtonHover : {})
                          }}
                          onMouseEnter={() => setHoveredButton(payment.id)}
                          onMouseLeave={() => setHoveredButton(null)}
                          title="삭제"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
              ))}

              {/* 푸터 */}
              <div style={styles.footer}>
            <span style={styles.footerText}>
              총 {payments.length}개의 결제 내역
            </span>
                <span style={styles.footerTotal}>
              총액: ${payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2)}
            </span>
              </div>
            </>
        )}
      </div>
  );
}

export default PaymentList;
