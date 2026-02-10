"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ViewMode = "sidebar" | "dock";

interface LayoutContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("layout-view-mode") as ViewMode) || "sidebar"
      );
    }
    return "sidebar";
  });

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("layout-view-mode", mode);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === "sidebar" ? "dock" : "sidebar";
    handleSetViewMode(newMode);
  };

  return (
    <LayoutContext.Provider
      value={{ viewMode, setViewMode: handleSetViewMode, toggleViewMode }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
