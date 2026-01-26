"use client";

import { Header } from "@/components/layout";

export default function DocsPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex gap-12">
                {/* Navigation Sidebar */}
                <div className="w-64 flex-shrink-0 space-y-8 sticky top-6 self-start">
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Introduction</h3>
                        <ul className="space-y-2 text-sm text-gray-600 border-l border-gray-200 pl-4">
                            <li className="text-black font-medium -ml-[17px] border-l-2 border-black pl-4">Quick Start</li>
                            <li>Authentication</li>
                            <li>Errors</li>
                            <li>Rate Limits</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-600 border-l border-gray-200 pl-4">
                            <li>Leads</li>
                            <li>Transactions</li>
                            <li>Users</li>
                            <li>Webhooks</li>
                        </ul>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 prose prose-slate max-w-none">
                    <h1 className="font-serif text-4xl">Documentation API</h1>
                    <p className="lead text-xl text-gray-500 font-light">
                        Intégrez la puissance de Uprising Node directement dans vos systèmes CRM et ERP.
                    </p>

                    <div className="not-prose bg-gray-50 p-6 rounded-sm border border-gray-200 my-8">
                        <h4 className="font-bold text-sm mb-2">Base URL</h4>
                        <code className="bg-black text-white px-3 py-1 rounded text-sm">https://api.uprising.node/v1</code>
                    </div>

                    <h2>Authentication</h2>
                    <p>
                        The API uses Bearer tokens. Include your API key in the Authorization header.
                    </p>
                    <pre className="bg-black text-white p-4 rounded">
                        Authorization: Bearer sk_live_...
                    </pre>

                    <h2>Endpoints</h2>

                    <h3>Create a Lead</h3>
                    <p>POST <code>/leads</code></p>
                    <p>Submits a new URL for automated analysis.</p>

                    <h3>Get Profile</h3>
                    <p>GET <code>/users/me</code></p>
                    <p>Returns current operator profile and quotas.</p>

                </div>
            </main>
        </div>
    );
}
