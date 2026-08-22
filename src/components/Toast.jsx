import { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <span className="toast-icon">{iconMap[type] || "ℹ️"}</span>
        <span className="toast-message">{message}</span>
        <button
          className="toast-close"
          onClick={() => {
            setVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          animation: slideInRight 0.4s ease;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          color: white;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          min-width: 280px;
          max-width: 420px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
        }

        .toast-success {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .toast-error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .toast-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        .toast-info {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .toast-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .toast-message {
          flex: 1;
          font-size: 0.95rem;
        }
        .toast-close {
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 6px;
          transition: 0.2s;
        }
        .toast-close:hover {
          background: rgba(255,255,255,0.25);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(80px);
          }
        }

        .toast-exit {
          animation: slideOutRight 0.3s ease forwards;
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
          }
          .toast {
            min-width: auto;
            max-width: 100%;
            padding: 12px 16px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
