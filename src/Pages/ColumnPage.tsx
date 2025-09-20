import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { TaskContext } from "../Contexts/Context";
import type { Column, Task } from "../Types/Types";

interface ModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const Modal: React.FC<ModalProps> = ({ task, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    const updatedTask = { ...task, title, description };
    onSave(updatedTask);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const ColumnPage: React.FC = () => {
  //Hämta kolumnens id och URL
  const { columnId } = useParams<{ columnId: string }>();

  //Använd context hook för att hämta data från taskContext
  const ctx = useContext(TaskContext);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  //Kontroll om context finns om ej kasta error
  if (!ctx) throw new Error("TaskContext is missing...");

  //extrahera kolumn från conext
  const { columns, updateTask, deleteTask } = ctx;

  //Söka efter kolumn vars id matchar url parametern
  const column = columns.find((c: Column) => c.id === columnId);

  //Om kolumnen ej finns visa meddelande
  if (!column) return <div>Column is not existing.</div>;

  //Rendera kolumntitel och dess uppgifter
  //Loopar igenom kolumnens uppgifter och visar varje uppgift
  return (
    <div className="single-column-placement">
      <div className="single-column-view">
        <h1>{column.title}</h1>
        {column.tasks.map((task: Task) => (
          <div
            key={task.id}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              marginBottom: "5px",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
            onClick={() => handleOpenModal(task)}
          >
            {task.title}
          </div>
        ))}

        {selectedTask && (
          <Modal
            task={selectedTask}
            onClose={handleCloseModal}
            onSave={(updatedTask: Task) => {
              updateTask(column.id, updatedTask.id, updatedTask);
              handleCloseModal();
            }}
            onDelete={(taskId: string) => {
              deleteTask(column.id, taskId);
              handleCloseModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ColumnPage;
