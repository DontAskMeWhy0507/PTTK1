import { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [modal, setModal] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setModal({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  }, []);

  return (
    <UIContext.Provider value={{ showNotification, showConfirm }}>
      {children}
      
      {/* Notifications Portal */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification notification-${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>

      {/* Modal Portal */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <div className="modal-actions">
              <button className="btn" onClick={modal.onCancel}>Hủy</button>
              <button className="btn btn-primary" onClick={modal.onConfirm}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
