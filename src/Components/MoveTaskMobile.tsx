// Components/MoveTaskMobile.tsx
import React, { useContext, useState } from "react";
import { TaskContext } from "../Contexts/Context";
//import type { Task, Column } from "../Types/Types";

const MoveTaskMobile: React.FC = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TaskContext is missing...");

  const { columns, moveTask } = ctx;

  // Samla alla tasks med kolumnId
  const allTasksWithColumn = columns.flatMap((col) =>
    col.tasks.map((task) => ({
      ...task,
      columnId: col.id,
    }))
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string | "">("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedTask = allTasksWithColumn.find((t) => t.id === selectedTaskId);

  // Funktion för att flytta task upp (till föregående kolumn)
  const moveTaskUp = () => {
    if (!selectedTask) return;
    const currentIndex = columns.findIndex(
      (col) => col.id === selectedTask.columnId
    );
    if (currentIndex <= 0) return; // kan inte flytta högre än första kolumn
    const targetColumnId = columns[currentIndex - 1].id;
    moveTask(selectedTask.columnId, targetColumnId, selectedTask.id);
    setSelectedTaskId("");
    setDropdownOpen(false);
  };

  // Funktion för att flytta task ner (till nästa kolumn)
  const moveTaskDown = () => {
    if (!selectedTask) return;
    const currentIndex = columns.findIndex(
      (col) => col.id === selectedTask.columnId
    );
    if (currentIndex === -1 || currentIndex >= columns.length - 1) return; // kan inte flytta ner från sista kolumn
    const targetColumnId = columns[currentIndex + 1].id;
    moveTask(selectedTask.columnId, targetColumnId, selectedTask.id);
    setSelectedTaskId("");
    setDropdownOpen(false);
  };

  return (
    <div
      style={{
        margin: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        backgroundColor: "#fafafa",
      }}
    >
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>
        {dropdownOpen ? "Close Move Task" : "Move Task"}
      </button>

      {dropdownOpen && (
        <div style={{ marginTop: "1rem" }}>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            style={{ padding: "0.5rem", width: "100%" }}
          >
            <option value="" disabled>
              Select a task to move
            </option>
            {allTasksWithColumn.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title} (
                {columns.find((c) => c.id === task.columnId)?.title})
              </option>
            ))}
          </select>

          {selectedTask && (
            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <button
                onClick={moveTaskUp}
                disabled={
                  columns.findIndex((c) => c.id === selectedTask.columnId) === 0
                }
              >
                ⬆️
              </button>
              <button
                onClick={moveTaskDown}
                disabled={
                  columns.findIndex((c) => c.id === selectedTask.columnId) ===
                  columns.length - 1
                }
              >
                ⬇️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoveTaskMobile;
