"use client";

import { useState, useEffect } from "react";

interface LogEntry {
    time: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
}

const initialLogs: LogEntry[] = [
    { time: "22:04:12", type: "info", message: "[SYS] Node Uprising v2.4 initialized" },
    { time: "22:04:13", type: "success", message: "[CONN] Database connection established" },
    { time: "22:04:14", type: "info", message: "[API] External feeds syncing..." },
    { time: "22:04:17", type: "success", message: "[API] Market data stream active" },
    { time: "22:04:21", type: "info", message: "[ML] Loading prediction models..." },
    { time: "22:04:28", type: "success", message: "[ML] GPT-4o model ready" },
    { time: "22:04:32", type: "warning", message: "[ALERT] High activity detected: TechVision Corp" },
    { time: "22:04:45", type: "info", message: "[SCAN] Processing 847 signals..." },
];

interface NodeData {
    id: string;
    name: string;
    status: "active" | "standby" | "processing";
    load: number;
}

const nodes: NodeData[] = [
    { id: "N-001", name: "Scraper Alpha", status: "active", load: 67 },
    { id: "N-002", name: "Analyzer Beta", status: "processing", load: 89 },
    { id: "N-003", name: "Predictor Gamma", status: "active", load: 45 },
    { id: "N-004", name: "Enricher Delta", status: "standby", load: 12 },
];

export default function ExpertModePage() {
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [command, setCommand] = useState("");

    // Simulate live logs
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog: LogEntry = {
                time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
                type: Math.random() > 0.7 ? "warning" : Math.random() > 0.5 ? "success" : "info",
                message: `[SCAN] Signal processed: ${Math.floor(Math.random() * 1000)}`,
            };
            setLogs((prev) => [...prev.slice(-15), newLog]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        const newLog: LogEntry = {
            time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
            type: "info",
            message: `> ${command}`,
        };
        setLogs((prev) => [...prev, newLog]);
        setCommand("");
    };

    return (
        <div className="bg-black min-h-screen flex flex-col font-mono text-white overflow-x-hidden antialiased selection:bg-white/20 selection:text-white">
            {/* Custom Dark Header */}
            <header className="w-full bg-black border-b border-white/10 sticky top-0 z-40">
                <div className="px-6 py-4 flex items-center justify-between max-w-full">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-white">
                            <span className="material-symbols-outlined text-xl">terminal</span>
                            <span className="text-sm font-medium tracking-wider">
                                EXPERT MODE
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest">
                                Connected
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 text-xs">
                        <span>v2.4.1</span>
                        <span>|</span>
                        <span>Latency: 12ms</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5">
                {/* Left: Nodes Status */}
                <div className="lg:col-span-3 bg-black p-6 space-y-6">
                    <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                        Node Status
                    </h2>

                    <div className="space-y-3">
                        {nodes.map((node) => (
                            <div
                                key={node.id}
                                className="p-3 border border-white/10 hover:border-white/30 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-white/60">{node.id}</span>
                                    <span
                                        className={`text-[9px] uppercase px-1.5 py-0.5 ${node.status === "active"
                                            ? "bg-green-500/20 text-green-400"
                                            : node.status === "processing"
                                                ? "bg-amber-500/20 text-amber-400"
                                                : "bg-white/10 text-white/40"
                                            }`}
                                    >
                                        {node.status}
                                    </span>
                                </div>
                                <p className="text-sm text-white mb-2">{node.name}</p>
                                <div className="w-full h-1 bg-white/10">
                                    <div
                                        className="h-full bg-white/60 transition-all duration-500 w-(--load)"
                                        style={{ "--load": `${node.load}%` } as React.CSSProperties}
                                    />
                                </div>
                                <p className="text-[10px] text-white/30 mt-1">{node.load}% load</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Log Stream */}
                <div className="lg:col-span-6 bg-black p-6 flex flex-col">
                    <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                        Live Feed
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-1 mb-4 font-mono text-xs max-h-[60vh]">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-white/30 shrink-0">{log.time}</span>
                                <span
                                    className={
                                        log.type === "success"
                                            ? "text-green-400"
                                            : log.type === "warning"
                                                ? "text-amber-400"
                                                : log.type === "error"
                                                    ? "text-red-400"
                                                    : "text-white/60"
                                    }
                                >
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Command Input */}
                    <form onSubmit={handleCommand} className="border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">$</span>
                            <input
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                placeholder="Enter command..."
                                className="flex-1 bg-transparent text-white placeholder:text-white/20 outline-none text-sm"
                            />
                        </div>
                    </form>
                </div>

                {/* Right: Metrics */}
                <div className="lg:col-span-3 bg-black p-6 space-y-6">
                    <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                        System Metrics
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase mb-1">Signals/hr</p>
                            <p className="text-2xl text-white">2,847</p>
                        </div>
                        <div className="p-4 border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase mb-1">Active Leads</p>
                            <p className="text-2xl text-white">156</p>
                        </div>
                        <div className="p-4 border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase mb-1">Model Accuracy</p>
                            <p className="text-2xl text-green-400">94.2%</p>
                        </div>
                        <div className="p-4 border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase mb-1">Uptime</p>
                            <p className="text-2xl text-white">99.97%</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                        <button className="w-full py-2 text-xs uppercase tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors">
                            Export Logs
                        </button>
                        <button className="w-full py-2 text-xs uppercase tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors">
                            Force Sync
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
