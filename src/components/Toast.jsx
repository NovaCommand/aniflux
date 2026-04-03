import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg
              transition-all duration-300 animate-slide-up
              ${toast.type === 'success' ? 'bg-green-600' : ''}
              ${toast.type === 'error'   ? 'bg-red-600'   : ''}
              ${toast.type === 'info'    ? 'bg-blue-600'  : ''}
            `}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

export { ToastProvider, useToast };