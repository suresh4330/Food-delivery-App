import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

const TOAST_ICONS = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((current) => [...current, { id, message, type }]);
        window.setTimeout(() => removeToast(id), 3200);
    }, [removeToast]);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="qb-toast-stack">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const Icon = TOAST_ICONS[toast.type] || Info;
                        return (
                            <motion.div
                                className={`qb-toast qb-toast-${toast.type}`}
                                key={toast.id}
                                initial={{ opacity: 0, x: 28, scale: 0.96 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 28, scale: 0.96 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                <Icon size={19} />
                                <span>{toast.message}</span>
                                <button type="button" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
                                    <X size={15} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
