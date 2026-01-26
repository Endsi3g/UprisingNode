"use client";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui";

export default function SandboxPage() {
    return (
        <div className="bg-[#1e1e1e] min-h-screen flex flex-col font-mono text-gray-300">
            <Header userName="K. Miller" userRole="Dev Mode" />

            <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-[#252526] border-r border-[#333] p-4 flex flex-col gap-2">
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Collections</div>
                    <button className="text-left px-3 py-2 bg-[#37373d] text-white rounded text-sm">Create Lead</button>
                    <button className="text-left px-3 py-2 hover:bg-[#2a2d2e] rounded text-sm">Get User Profile</button>
                    <button className="text-left px-3 py-2 hover:bg-[#2a2d2e] rounded text-sm">List Transactions</button>
                </div>

                {/* Main Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="h-12 border-b border-[#333] flex items-center px-4 gap-4 bg-[#1e1e1e]">
                        <span className="text-green-400 font-bold">POST</span>
                        <input type="text" value="https://api.uprising.node/v1/leads" className="bg-transparent text-white w-full focus:outline-none" readOnly />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">Send</Button>
                    </div>

                    <div className="flex-1 flex">
                        {/* Request Body */}
                        <div className="flex-1 border-r border-[#333] p-4">
                            <div className="text-xs text-gray-500 mb-2">Body (JSON)</div>
                            <textarea className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-[#ce9178]" defaultValue={`{
  "company": "TechCorp",
  "url": "https://techcorp.io",
  "owner": "usr_123"
}`} />
                        </div>

                        {/* Response */}
                        <div className="flex-1 p-4 bg-[#1e1e1e]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">Response</span>
                                <span className="text-xs text-green-500">201 Created • 45ms</span>
                            </div>
                            <pre className="text-sm text-[#9cdcfe]">{`{
  "id": "lead_89230",
  "status": "PROSPECT",
  "score": 85,
  "created_at": "2026-01-25T14:22:00Z"
}`}</pre>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
