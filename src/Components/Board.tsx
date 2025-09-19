import React, { useContext, useState } from "react";
import type { Task } from "../Types/Types";
import Column from "./Column";
import { TaskContext } from "../Contexts/Context";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Modal from "./Modal";
import { useSearchParams } from "react-router-dom";
import MoveTaskMobile from "./MoveTaskMobile";
import useMediaQuery from "../Hooks/UseMediaQuery";

const Board: React.FC = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TasksContext is missing...");

  const { columns, moveTask, updateTask, deleteTask } = ctx;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedColumnId = searchParams.get("column");

  const columnsToRender = selectedColumnId
    ? columns.filter((col) => col.id === selectedColumnId)
    : columns;

  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleOpenTaskModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) return;

    const activeData = active.data.current;
    const overId = over.id as string;

    if (activeData && activeData.columnId !== overId) {
      moveTask(activeData.columnId, overId, active.id as string);
    }
  };
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

      {isMobile && <MoveTaskMobile />}

      {/* Visa kolumnerna ALLTID, oavsett skärmstorlek */}
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="columns-container"
          style={{
            display: "flex",
            gap: "10px",
            padding: "20px",
            justifyContent: "space-around",
            flexWrap: "wrap", // Kan hjälpa på mindre skärmar
          }}
        >
          <div className="columns-container">
            {columnsToRender.map((col) => (
              <Column
                key={col.id}
                column={col}
                columns={columns}
                onRequestOpen={handleOpenTaskModal}
                onDeleteTask={(taskId) => deleteTask(col.id, taskId)}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
