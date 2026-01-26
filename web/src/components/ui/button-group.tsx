import * as React from "react";
import { cn } from "@/lib/utils";

const ButtonGroupContext = React.createContext<{
    orientation: "horizontal" | "vertical";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}>({
    orientation: "horizontal",
});

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
    ({ className, orientation = "horizontal", children, ...props }, ref) => {
        return (
            <ButtonGroupContext.Provider value={{ orientation }}>
                <div
                    ref={ref}
                    role="group"
                    data-orientation={orientation}
                    className={cn(
                        "inline-flex",
                        orientation === "vertical" ? "flex-col" : "flex-row",
                        className
                    )}
                    {...props}
                >
                    {React.Children.map(children, (child, index) => {
                        if (!React.isValidElement(child)) return child;

                        // Allow separating lines or other non-button elements to pass through
                        if (
                            child.type === ButtonGroupSeparator ||
                            (typeof child.type === 'function' && child.type.name === 'ButtonGroupSeparator')
                        ) {
                            return child;
                        }

                        return React.cloneElement(child, {
                            className: cn(
                                // Base styles are handled by the button itself
                                // We mainly need to handle border radius and borders between items

                                // Horizontal orientation
                                orientation === "horizontal" && [
                                    // First child
                                    index === 0 && "rounded-r-none border-r-0",
                                    // Check if it's the last child
                                    index === React.Children.count(children) - 1 && "rounded-l-none",
                                    // Middle children
                                    index > 0 && index < React.Children.count(children) - 1 && "rounded-none border-r-0",
                                    // Add border left to items that are not first (if using outlined buttons)
                                    index > 0 && "border-l-0"
                                ],

                                // Vertical orientation
                                orientation === "vertical" && [
                                    // First child
                                    index === 0 && "rounded-b-none border-b-0",
                                    // Last child
                                    index === React.Children.count(children) - 1 && "rounded-t-none",
                                    // Middle children
                                    index > 0 && index < React.Children.count(children) - 1 && "rounded-none border-b-0",
                                ],

                                // Merge any existing classNames
                                (child.props as any).className
                            ),
                        } as any);
                    })}
                </div>
            </ButtonGroupContext.Provider>
        );
    }
);
ButtonGroup.displayName = "ButtonGroup";

interface ButtonGroupSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
    ({ className, orientation, ...props }, ref) => {
        const context = React.useContext(ButtonGroupContext);
        const resolvedOrientation = orientation || context.orientation;

        return (
            <div
                ref={ref}
                className={cn(
                    "bg-border",
                    resolvedOrientation === "horizontal" ? "w-px my-1" : "h-px mx-1",
                    className
                )}
                {...props}
            />
        );
    }
);
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator };
