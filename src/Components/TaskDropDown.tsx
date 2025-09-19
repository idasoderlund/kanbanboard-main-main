import React from "react";
import type { Task } from "../Types/Types";

interface TaskDropDownProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onClose: () => void;
}

const TaskDropdown: React.FC<TaskDropDownProps> = ({
  tasks,
  onSelect,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50px",
        right: "0",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            padding: "5px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            marginBottom: "5px",
          }}
          onClick={() => {
            onSelect(task);
            onClose();
          }}
        >
          {task.title}
        </div>
      ))}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
export default TaskDropdown;
