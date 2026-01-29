"use client";

import { Header } from "@/components/layout";
import { Card } from "@/components/ui";

const logs = [
  {
    id: "req_1",
    time: "2026-01-25 10:42:01",
    method: "POST",
    path: "/v1/leads",
    status: 201,
    latency: "45ms",
  },
  {
    id: "req_2",
    time: "2026-01-25 10:41:55",
    method: "GET",
    path: "/v1/users/me",
    status: 200,
    latency: "12ms",
  },
  {
    id: "req_3",
    time: "2026-01-25 10:38:12",
    method: "POST",
    path: "/v1/webhooks",
    status: 400,
    latency: "8ms",
  },
  {
    id: "req_4",
    time: "2026-01-25 10:35:05",
    method: "GET",
    path: "/v1/leads/sync",
    status: 200,
    latency: "120ms",
  },
  {
    id: "req_5",
    time: "2026-01-25 10:30:00",
    method: "DELETE",
    path: "/v1/keys/sk_test_...992a",
    status: 204,
    latency: "30ms",
  },
];

export default function LogsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        <h1 className="text-3xl font-serif text-black">Logs API</h1>

        <Card title="Traffic Récent">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Latency</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">{log.time}</td>
                    <td className="px-4 py-3 font-bold">{log.method}</td>
                    <td className="px-4 py-3">{log.path}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded textxs font-bold ${
                          log.status >= 200 && log.status < 300
                            ? "bg-green-100 text-green-700"
                            : log.status >= 400
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
