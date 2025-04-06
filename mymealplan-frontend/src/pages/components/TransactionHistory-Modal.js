import React from 'react';
import './TransactionHistory-Modal.css';

const TransactionHistoryModal = ({ firstName, transactions, onClose }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-modal-overlay">
      <div className="history-modal">
        <button className="history-close" onClick={onClose}>×</button>
        <h2>Transaction History for {firstName}</h2>
        {transactions.length === 0 ? (
          <p className="empty-transactions">No transactions yet.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((tx, index) => (
              <li key={index}>
                <span className="tx-location">{tx.location}</span>
                <span className="tx-type">
                  {tx.type === 'meal' ? '1 Meal Swipe' : `$${parseFloat(tx.amount).toFixed(2)} Flex`}
                </span>
                <span className="tx-time">{formatTimestamp(tx.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
