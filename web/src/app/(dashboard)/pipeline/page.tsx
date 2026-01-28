"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { leadsService } from "@/services/api.service";
import { toast } from "sonner";

// Define Types
interface Lead {
    id: string;
    companyName?: string;
    url: string;
    score?: number;
    value?: number;
    status: string;
}

const initialColumns = {
    PROSPECT: {
        id: "PROSPECT",
        title: "Prospect",
        items: [] as Lead[],
    },
    AUDIT: {
        id: "AUDIT",
        title: "En Audit",
        items: [] as Lead[],
    },
    PITCH: {
        id: "PITCH",
        title: "Pitch",
        items: [] as Lead[],
    },
    SIGNED: {
        id: "SIGNED",
        title: "Signé",
        items: [] as Lead[],
    },
};

export default function PipelinePage() {
    const [columns, setColumns] = useState(initialColumns);
    const [totalPipeline, setTotalPipeline] = useState(0);

    const fetchLeads = async () => {
        try {
            const leads = await leadsService.getAll() as Lead[];

            // Organize leads into columns
            const newColumns = {
                PROSPECT: { ...initialColumns.PROSPECT, items: [] as Lead[] },
                AUDIT: { ...initialColumns.AUDIT, items: [] as Lead[] },
                PITCH: { ...initialColumns.PITCH, items: [] as Lead[] },
                SIGNED: { ...initialColumns.SIGNED, items: [] as Lead[] },
            };

            let total = 0;

            leads.forEach(lead => {
                const status = lead.status as keyof typeof newColumns;
                if (newColumns[status]) {
                    newColumns[status].items.push(lead);
                    total += lead.value || 0;
                } else {
                    // Fallback for unknown status
                    newColumns.PROSPECT.items.push(lead);
                }
            });

            setColumns(newColumns);
            setTotalPipeline(total);
        } catch (error) {
            console.error("Failed to fetch leads", error);
            toast.error("Impossible de charger le pipeline");
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId as keyof typeof columns];
            const destColumn = columns[destination.droppableId as keyof typeof columns];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            // Optimistic Update
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });

            // API Call
            try {
                await leadsService.update(draggableId, { status: destination.droppableId });
            } catch (error) {
                console.error("Failed to update status", error);
                toast.error("Erreur lors de la mise à jour");
                // Revert changes could be done here
                fetchLeads();
            }
        } else {
            const column = columns[source.droppableId as keyof typeof columns];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems },
            });
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
                            <span className="text-xs uppercase tracking-widest text-gray-400">Total Pipeline: {totalPipeline.toLocaleString()} €</span>
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
                                                                    <span className="text-sm font-medium truncate max-w-[150px]">{item.companyName || item.url}</span>
                                                                    {item.score !== undefined && (
                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.score > 90 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                                            }`}>
                                                                            {item.score}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-serif">
                                                                    Est. {item.value || 0} €
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
