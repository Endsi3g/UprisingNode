"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { leadsService } from "@/services/api.service";
import { useSocket } from "@/providers/socket-provider";
import { toast } from "sonner";

interface Lead {
    id: string;
    companyName: string | null;
    url: string;
    status: string;
    score: number | null;
    // value field is missing in DB, assuming calculated or placeholder
}

// Map DB status to Column ID
const statusToColumn: Record<string, string> = {
    "PROSPECT": "prospect",
    "AUDIT": "audit",
    "PITCH": "pitch",
    "SIGNED": "signed"
};

// Map Column ID to DB status
const columnToStatus: Record<string, string> = {
    "prospect": "PROSPECT",
    "audit": "AUDIT",
    "pitch": "PITCH",
    "signed": "SIGNED"
};

const initialColumns = {
    prospect: { id: "prospect", title: "Prospect", items: [] as Lead[] },
    audit: { id: "audit", title: "En Audit", items: [] as Lead[] },
    pitch: { id: "pitch", title: "Pitch", items: [] as Lead[] },
    signed: { id: "signed", title: "Signé", items: [] as Lead[] },
};

export default function PipelinePage() {
    const [columns, setColumns] = useState(initialColumns);
    const { socket } = useSocket();

    const fetchLeads = useCallback(async () => {
        try {
            const leads = await leadsService.getAll();
            const newColumns = {
                prospect: { ...initialColumns.prospect, items: [] as Lead[] },
                audit: { ...initialColumns.audit, items: [] as Lead[] },
                pitch: { ...initialColumns.pitch, items: [] as Lead[] },
                signed: { ...initialColumns.signed, items: [] as Lead[] },
            };

            leads.forEach((lead: Lead) => {
                const colId = statusToColumn[lead.status] || "prospect";
                if (newColumns[colId as keyof typeof newColumns]) {
                    newColumns[colId as keyof typeof newColumns].items.push(lead);
                }
            });

            setColumns(newColumns);
        } catch (error) {
            console.error("Failed to fetch leads", error);
            toast.error("Erreur lors du chargement des leads");
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    useEffect(() => {
        if (!socket) return;

        const handleLeadUpdate = (updatedLead: Lead) => {
            setColumns((prev) => {
                const newColumns = { ...prev };
                let leadFound = false;

                // Remove from old column
                Object.keys(newColumns).forEach((key) => {
                    const colKey = key as keyof typeof newColumns;
                    const filtered = newColumns[colKey].items.filter(l => l.id !== updatedLead.id);
                    if (filtered.length !== newColumns[colKey].items.length) {
                        newColumns[colKey] = { ...newColumns[colKey], items: filtered };
                        leadFound = true;
                    }
                });

                // Add to new column
                const targetCol = statusToColumn[updatedLead.status];
                if (targetCol && newColumns[targetCol as keyof typeof newColumns]) {
                     // Check if already exists to avoid dupes (if multiple events fire)
                     const exists = newColumns[targetCol as keyof typeof newColumns].items.find(l => l.id === updatedLead.id);
                     if (!exists) {
                         newColumns[targetCol as keyof typeof newColumns].items.push(updatedLead);
                     }
                }

                return { ...newColumns };
            });
        };

        socket.on("lead-updated", handleLeadUpdate);

        return () => {
            socket.off("lead-updated", handleLeadUpdate);
        };
    }, [socket]);

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Optimistic Update
        const sourceColumn = columns[source.droppableId as keyof typeof columns];
        const destColumn = columns[destination.droppableId as keyof typeof columns];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [movedLead] = sourceItems.splice(source.index, 1);

        // Update status locally
        const newStatus = columnToStatus[destination.droppableId];
        const updatedLead = { ...movedLead, status: newStatus };

        destItems.splice(destination.index, 0, updatedLead);

        setColumns({
            ...columns,
            [source.droppableId]: { ...sourceColumn, items: sourceItems },
            [destination.droppableId]: { ...destColumn, items: destItems },
        });

        // API Call
        try {
            await leadsService.update(draggableId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update lead status", error);
            toast.error("Erreur lors de la mise à jour");
            fetchLeads(); // Revert on error
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 p-6 overflow-x-auto">
                <div className="min-w-[1000px] h-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-serif text-black">Pipeline Node</h1>
                        <div className="flex gap-4">
                            <span className="text-xs uppercase tracking-widest text-gray-400">Total Leads: {Object.values(columns).reduce((acc, col) => acc + col.items.length, 0)}</span>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 h-[calc(100vh-200px)]">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex-1 flex flex-col min-w-[250px]">
                                    <h2 className="text-xs uppercase tracking-widest font-bold mb-4 flex justify-between">
                                        {column.title}
                                        <span className="text-gray-400">{column.items.length}</span>
                                    </h2>
                                    <Droppable droppableId={columnId}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex-1 bg-gray-50/50 rounded-sm p-3 space-y-3"
                                            >
                                                {column.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="text-sm font-medium">{item.companyName || item.url}</span>
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.score && item.score > 90 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                        {item.score || 0}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-serif">
                                                                    {/* Est. Value placeholder */}
                                                                    Status: {item.status}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </main>
        </div>
    );
}
