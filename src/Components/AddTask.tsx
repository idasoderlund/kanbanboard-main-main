import React, { useState } from "react";

interface AddTaskFormProps {
  onAdd: (title: string, description: string) => void;
  onCancel: () => void;
  columnTitle: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAdd,
  onCancel,
  columnTitle,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, description);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#E4EFE7",
        marginBottom: "20px",
      }}
    >
      <h4
        style={{
          color: "#a1c2bd",
          textShadow: "1px 1px 2px #000",
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        New task in {columnTitle}
      </h4>
      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Beskrivning:"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button
        style={{
          margin: "5px",
          fontSize: "13px",
          marginLeft: "15px",
        }}
        onClick={handleSubmit}
      >
        Add
      </button>
      <button style={{ margin: "5px", fontSize: "13px" }} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default AddTaskForm;
