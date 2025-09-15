import React, { useContext, useState } from "react";
import type { Task } from "../Types/Types";
import Column from "./Column";
import { TaskContext } from "../Contexts/Context";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Modal from "./Modal";
import { useSearchParams } from "react-router-dom";

//Funktion hämtar taskcontext med data om funktion och kolumn som flyttar uppgifter
const Board: React.FC = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TasksContext is missing...");

  //Destrukturerar kolumn och funktion för att flytta uppgifter
  const { columns, moveTask, updateTask, deleteTask } = ctx;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedColumnId = searchParams.get("column");

  const columnsToRender = selectedColumnId
    ? columns.filter((col) => col.id === selectedColumnId)
    : columns;

  const handleOpenTaskModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
  };

  //Funktion som hanteras när en dragnng (drag) avslutas
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) return;

    //Hämtar data kopplat till aktiv dragning inlkusive vilken kolumn den ska tillhöra
    const activeData = active.data.current;
    const overId = over.id as string;

    //Kontroll om dragning mellan kolumnerna
    if (activeData && activeData.columnId !== overId) {
      moveTask(activeData.columnId, overId, active.id as string);
    }
  };

  //Renderar brädan med kolumnerna den är innesluten i DndContext för drag&släpp
  return (
    <div>
      {selectedColumnId && (
        <button onClick={() => setSearchParams({})}>Back to board</button>
      )}
      {selectedTask && (
        <Modal
          task={selectedTask}
          onClose={handleCloseTaskModal}
          onSave={(updatedTask) => {
            const colId = columns.find((c) =>
              c.tasks.some((t) => t.id === updatedTask.id)
            )?.id;
            if (colId) {
              updateTask(colId, updatedTask.id, updatedTask);
            }
            handleCloseTaskModal();
          }}
          onDelete={(taskId) => {
            const col = columns.find((c) =>
              c.tasks.some((t) => t.id === taskId)
            )?.id;
            if (col) {
              deleteTask(col, taskId);
            }
            handleCloseTaskModal();
          }}
        />
      )}
      <DndContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "20px",
            justifyContent: "space-around",
          }}
        >
          {columnsToRender.map((col) => (
            <Column
              key={col.id}
              column={col}
              onRequestOpen={handleOpenTaskModal}
              onDeleteTask={(taskId) => deleteTask(col.id, taskId)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};
export default Board;
