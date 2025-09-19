import React, { /*useState,*/ useContext } from "react";
import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";
import { TaskContext } from "../Contexts/Context";
import type { Column as ColumnType, Task } from "../Types/Types";
import AddTaskForm from "./AddTask";
import DeleteTaskForm from "./DeleteTask";
import { useNavigate } from "react-router-dom";
//import { Direction } from "@dnd-kit/core/dist/types";

interface ColumnProps {
  column: ColumnType;
  columns: ColumnType[];
  onDeleteTask: (columnId: string, taskId: string) => void;
  onRequestOpen: (task: Task) => void;
}
//Funktionell komponent för att rendera en kolumn
const Column: React.FC<ColumnProps> = ({ column, columns, onRequestOpen }) => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TaskContext is missing...");

  const navigate = useNavigate();

  const handleColumnClick = () => {
    navigate(`/column/${column.id}`);
  };

  //Hantera visning av formulär för att lägga till uppgift
  const [showAddTaskForm, setShowAddTaskForm] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  //const [isSelected, setIsSelected] = React.useState(false);

  const handleAddClick = () => {
    setShowAddTaskForm(true);
  };

  const handleAddTask = (title: string, description: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`, //Generera ett unikt ID baserat på tidsstämpel
      title,
      description,
    };
    ctx.addTask(column.id, newTask);
    setShowAddTaskForm(false);
  };

  //Rendering för delete
  const handleRequestDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      ctx.deleteTask(column.id, taskToDelete.id);
      setTaskToDelete(null);
    }
  };
  //Funktion för att öppna deleteformuläret
  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleRequestOpen = (task: Task) => {
    console.log("choose task", task);
    onRequestOpen(task);
  };

  //Använder useDroppable för att göra kolumnen droppable i dnd-funktionaliteten
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const style = {
    backgroundColor: isOver ? "#f0f0f0" : "#fff",
    padding: "10px",
    minWidth: "200px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    height: "85vh",
    justifyContent: "center",
    //margin: isSelected ? "0 auto" : "initial",
    //transition: "all 0.3s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 //denna h3 är diverse text centrerad i varje kolumn
        onClick={handleColumnClick}
        style={{
          cursor: "pointer",
          textAlign: "center",
          marginBottom: "30px",
          color: "#a1c2bd",
          fontSize: "20px",
          textShadow: "1px 1px 2px #000",
        }}
      >
        {column.title}
      </h3>

      {showAddTaskForm && (
        <AddTaskForm
          onAdd={handleAddTask}
          onCancel={() => setShowAddTaskForm(false)}
          columnTitle={column.title}
        />
      )}
      {column.tasks?.map((task) => (
        <Card
          key={task.id}
          task={task}
          columnId={column.id}
          columnTasks={column.tasks}
          columns={columns}
          //columns={allColumns}
          onRequestDelete={() => handleRequestDelete(task)}
          onDeleteTask={() => ctx.deleteTask(column.id, task.id)}
          onRequestOpen={handleRequestOpen}
          onUpdateTask={(updatedTask) =>
            ctx.updateTask(column.id, updatedTask.id, updatedTask)
          }
          onMoveTask={(/*taskToMove, direction*/) => {}}
        />
      ))}

      {taskToDelete && (
        <DeleteTaskForm
          taskTitle={taskToDelete.title}
          onDelete={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div style={{ marginTop: "auto" }}>
        <button onClick={handleAddClick}>+ {column.title}</button>
      </div>
    </div>
  );
};

export default Column;
