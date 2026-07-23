import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Dialog */}
            <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-2xl animate-[slideUp_0.2s_ease-out]">
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
                
                {/* Content */}
                {children}
            </div>
        </div>
    );
}
