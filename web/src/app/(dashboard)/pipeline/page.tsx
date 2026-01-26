"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Mock Data
const initialColumns = {
    prospect: {
        id: "prospect",
        title: "Prospect",
        items: [
            { id: "lead-1", content: "DataFlow Industries", score: 87, value: "15k" },
            { id: "lead-2", content: "TechCorp SA", score: 45, value: "8k" },
        ],
    },
    audit: {
        id: "audit",
        title: "En Audit",
        items: [
            { id: "lead-3", content: "FinServe Global", score: 92, value: "45k" },
        ],
    },
    pitch: {
        id: "pitch",
        title: "Pitch",
        items: [],
    },
    signed: {
        id: "signed",
        title: "Signé",
        items: [
            { id: "lead-4", content: "BioMed Labs", score: 98, value: "120k" },
        ],
    },
};

export default function PipelinePage() {
    const [columns, setColumns] = useState(initialColumns);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId as keyof typeof columns];
            const destColumn = columns[destination.droppableId as keyof typeof columns];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });
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
                            <span className="text-xs uppercase tracking-widest text-gray-400">Total Pipeline: 188k €</span>
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
                                                                    <span className="text-sm font-medium">{item.content}</span>
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.score > 90 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                        {item.score}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-serif">
                                                                    Est. {item.value} €
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
