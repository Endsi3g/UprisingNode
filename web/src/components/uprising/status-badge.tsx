"use client";

import { cn } from "@/lib/utils";

type StatusVariant =
    | "online"
    | "offline"
    | "pending"
    | "success"
    | "warning"
    | "error"
    | "default";

interface StatusBadgeProps {
    text?: string;
    status?: string;
    variant?: StatusVariant;
    showDot?: boolean;
    className?: string;
}

/**
 * StatusBadge - Uprising Node style status indicator
 * 
 * Used for status displays like "EN LIGNE", "ANALYSE", "ACTIF / VÉRIFIÉ"
 * with optional colored dot indicator.
 */
export function StatusBadge({
    text,
    status,
    variant = "default",
    showDot = false,
    className,
}: StatusBadgeProps) {
    const variantStyles: Record<StatusVariant, { badge: string; dot: string }> = {
        online: {
            badge: "text-green-600 bg-green-50",
            dot: "bg-green-500/80",
        },
        offline: {
            badge: "text-gray-500 bg-gray-100",
            dot: "bg-gray-400",
        },
        pending: {
            badge: "text-amber-600 bg-amber-50",
            dot: "bg-amber-500",
        },
        success: {
            badge: "text-green-700 bg-green-100",
            dot: "bg-green-600",
        },
        warning: {
            badge: "text-amber-700 bg-amber-100",
            dot: "bg-amber-600",
        },
        error: {
            badge: "text-red-600 bg-red-50",
            dot: "bg-red-500",
        },
        default: {
            badge: "text-gray-500 bg-gray-100",
            dot: "bg-gray-400",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 px-2 py-1 rounded-sm",
                styles.badge,
                className
            )}
        >
            {showDot && (
                <div className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />
            )}
            <span className="text-[10px] font-medium uppercase tracking-widest">
                {text || status}
            </span>
        </div>
    );
}
