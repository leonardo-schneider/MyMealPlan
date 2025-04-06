// TransactionModal.js
import React from 'react';
import './Transaction-Modal.css';

const TransactionModal = ({ onCancel, onConfirm, location, setLocation }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Where did the transaction take place?</h3>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select a location</option>
          <option value="Cafeteria">Cafeteria</option>
          <option value="C-Store">C-Store</option>
          <option value="Dusty’s">Dusty’s</option>
          <option value="Daily Grind">Daily Grind</option>
        </select>

        <div className="modal-buttons">
          <button className="modal-confirm" onClick={onConfirm} disabled={!location}>
            Confirm
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
