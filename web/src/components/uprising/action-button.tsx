"use client";

import { cn } from "@/lib/utils";

interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "ghost";
    size?: "default" | "large";
    showArrow?: boolean;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

/**
 * ActionButton - Uprising Node style CTA button
 * 
 * Features the characteristic uppercase tracking, arrow animation on hover,
 * and the clean black/white aesthetic from the source designs.
 */
export function ActionButton({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "default",
    showArrow = true,
    disabled = false,
    className,
    fullWidth = false,
}: ActionButtonProps) {
    const variants = {
        primary:
            "bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md",
        secondary:
            "bg-white text-black border border-gray-200 hover:border-black",
        ghost:
            "bg-transparent text-gray-400 hover:text-black",
    };

    const sizes = {
        default: "py-4 px-6 text-xs",
        large: "py-5 px-8 text-xs",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "font-semibold uppercase tracking-[0.25em]",
                "transition-all duration-300",
                "flex items-center justify-center gap-3 group",
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <span>{children}</span>
            {showArrow && (
                <span
                    className={cn(
                        "material-symbols-outlined text-lg font-light",
                        "group-hover:translate-x-1 transition-transform duration-300"
                    )}
                >
                    arrow_forward
                </span>
            )}
        </button>
    );
}
