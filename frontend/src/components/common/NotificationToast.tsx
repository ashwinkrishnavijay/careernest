import React, { useEffect } from 'react';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
  isSms?: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose, isSms = true }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className="bg-slate-900 text-white rounded-xl shadow-xl p-4 flex items-start gap-3 border border-slate-700">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
          {isSms ? <MessageSquare className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div className="flex-1 pr-2">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-0.5">
            {isSms ? 'Twilio SMS Notification' : 'Success'}
          </div>
          <p className="text-sm text-slate-200">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
