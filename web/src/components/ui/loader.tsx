import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string; // Additional classes for size and color (e.g. text-primary, w-4 h-4)
    variant?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Loader({ className, variant = "spinner", size = "md" }: LoaderProps) {
    // Size mapping using tailwind sizing classes or specific px values
    // DaisyUI usually sets width/height. We'll simulate that with w/h classes.
    // xs=1rem, sm=1.5rem, md=2rem (default), lg=3rem, xl=4rem for some loaders roughly.
    // We'll trust the user to pass 'w-' classes in className for customization,
    // but provide sensible defaults via data attributes or helper classes if needed.

    // Implementation of animations using arbitrary CSS in styles or Tailwind extensions 
    // would be ideal, but for portability we will use standard classes + simple @keyframes injected if possible,
    // or rely on the user having these in globals.css. 
    // However, specifically for this Vibecoding task, we should provide the CSS or use Tailwind utilities.
    // Since we can't easily modify tailwind.config.ts in one go, we'll try to use standard SVG loaders or CSS constructions.
    // BUT the prompt requested DaisyUI style. DaisyUI uses mask-image or specific CSS.
    // The easiest way to get "DaisyUI" look without DaisyUI is to use simple CSS equivalents.

    // Let's use simple SVG implementations for reliability and fewer external CSS deps.

    const sizeClass = {
        xs: "w-4 h-4",
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    }[size];

    if (variant === "dots") {
        return (
            <div className={cn("flex space-x-1", sizeClass, className)}>
                <span className="sr-only">Loading...</span>
                <div className="h-full w-1/4 rounded-full bg-current animate-[bounce_1.4s_infinite_both] [animation-delay:-0.32s]"></div>
                <div className="h-full w-1/4 rounded-full bg-current animate-[bounce_1.4s_infinite_both] [animation-delay:-0.16s]"></div>
                <div className="h-full w-1/4 rounded-full bg-current animate-[bounce_1.4s_infinite_both]"></div>
            </div>
        );
    }

    if (variant === "ring") {
        // A simple ring spinner
        return (
            <div className={cn("inline-block rounded-full border-2 border-current border-t-transparent animate-spin", sizeClass, className)} role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    if (variant === "ball") {
        // Bouncing ball equivalent
        return (
            <div className={cn("relative flex items-center justify-center", sizeClass, className)}>
                <div className="absolute w-full h-full rounded-full bg-current opacity-75 animate-ping"></div>
                <div className="relative w-3/4 h-3/4 rounded-full bg-current"></div>
            </div>
        )
    }

    if (variant === "bars") {
        return (
            <div className={cn("flex items-end justify-center space-x-1", sizeClass, className)}>
                <div className="w-1.5 h-full bg-current animate-[pulse_1s_ease-in-out_infinite] [animation-delay:0.1s]"></div>
                <div className="w-1.5 h-full bg-current animate-[pulse_1s_ease-in-out_infinite] [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-full bg-current animate-[pulse_1s_ease-in-out_infinite] [animation-delay:0.3s]"></div>
            </div>
        )
    }

    // Default Spinner
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", sizeClass, className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
