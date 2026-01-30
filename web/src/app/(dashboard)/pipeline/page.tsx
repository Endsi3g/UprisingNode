"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { leadsService } from "@/services/api.service";

// Column Types
type ColumnType = "prospect" | "audit" | "pitch" | "signed";

const columnTitles: Record<ColumnType, string> = {
  prospect: "Prospect",
  audit: "En Audit",
  pitch: "Pitch",
  signed: "Signé",
};

// Status Mapping
const statusToColumn: Record<string, ColumnType> = {
  PROSPECT: "prospect",
  ANALYSIS: "audit",
  PITCH: "pitch",
  CLOSED: "signed",
  // 'LOST': 'prospect', // Handle lost leads if needed
};

const columnToStatus: Record<ColumnType, string> = {
  prospect: "PROSPECT",
  audit: "ANALYSIS",
  pitch: "PITCH",
  signed: "CLOSED",
};

export default function PipelinePage() {
  const [columns, setColumns] = useState<Record<string, any>>({
    prospect: { id: "prospect", title: "Prospect", items: [] },
    audit: { id: "audit", title: "En Audit", items: [] },
    pitch: { id: "pitch", title: "Pitch", items: [] },
    signed: { id: "signed", title: "Signé", items: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const leads = await leadsService.getAll();
      const newColumns: any = {
        prospect: { id: "prospect", title: "Prospect", items: [] },
        audit: { id: "audit", title: "En Audit", items: [] },
        pitch: { id: "pitch", title: "Pitch", items: [] },
        signed: { id: "signed", title: "Signé", items: [] },
      };

      leads.forEach((lead: any) => {
        const colId = statusToColumn[lead.status] || "prospect";
        if (newColumns[colId]) {
          newColumns[colId].items.push({
            id: lead.id,
            content: lead.companyName || lead.url,
            score: lead.score || 0,
            value: ((lead.score || 0) * 100).toLocaleString() + "k", // Mock value logic
          });
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      // Optimistic Update
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });

      // API Call
      try {
        const newStatus = columnToStatus[destination.droppableId as ColumnType];
        await leadsService.update(draggableId, { status: newStatus });
      } catch (error) {
        console.error("Failed to update lead status", error);
        // Revert on failure (optional, skipping for MVP complexity)
        fetchLeads();
      }
    } else {
      const column = columns[source.droppableId];
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
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Total Pipeline: {loading ? "..." : "Calculating..."}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-[calc(100vh-200px)]">
                {Object.entries(columns).map(([columnId, column]) => (
                  <div
                    key={columnId}
                    className="flex-1 flex flex-col min-w-[250px]"
                  >
                    <h2 className="text-xs uppercase tracking-widest font-bold mb-4 flex justify-between">
                      {column.title}
                      <span className="text-gray-400">
                        {column.items.length}
                      </span>
                    </h2>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex-1 bg-gray-50/50 rounded-sm p-3 space-y-3"
                        >
                          {column.items.map((item: any, index: number) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium">
                                      {item.content}
                                    </span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                                        item.score > 90
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
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
          )}
        </div>
      </main>
    </div>
  );
}
