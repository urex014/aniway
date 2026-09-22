import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = "Telemetry Signal Disrupted",
  message = "Upstream broadcaster stream experienced latency. Automated failover was engaged.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-[#18181F]/90 border border-red-500/20 text-center my-6 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-white font-mono mb-1">{title}</h4>
      <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111116] hover:bg-[#1f1f2a] border border-white/10 text-xs font-medium text-white transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
}
