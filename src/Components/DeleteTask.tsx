import React from "react";

interface DeleteFormProps {
  onDelete: () => void;
  onCancel: () => void;
  taskTitle: string;
}

const DeleteTaskForm: React.FC<DeleteFormProps> = ({
  onDelete,
  onCancel,
  taskTitle,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        marginBottom: "20px",
        maxWidth: "400px",
      }}
    >
      <h4>Delete task in {taskTitle}</h4>
      <p>Are you sure you want to delete this task?</p>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteTaskForm;
