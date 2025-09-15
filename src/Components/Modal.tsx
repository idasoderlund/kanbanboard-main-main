import React, { useState, useEffect } from "react";
import type { Task } from "../Types/Types";

//Definerar props som modalkomponenten ska ta emot
interface ModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (TaskId: string) => void;
}
//en komponent med props av typen modalprops
const Modal: React.FC<ModalProps> = ({ task, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  //Om task ändras, synkronisera local state
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
  }, [task]);

  //Funktion som körs när användaren klickar på spara knappen
  const handleSave = () => {
    //Skickar uppdaterad task till onSave funktionen som är en prop med ny titel och beskrivning
    onSave({ ...task, title, description });
    //Stänger modalen efter sparning
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        width: "150",
      }}
    >
      <div
        style={{
          backgroundColor: "#E4EFE7",
          padding: "20px",
          borderRadius: "5px",
          width: "300px",
        }}
      >
        <h2
          style={{
            color: "#a1c2bd",
            textShadow: "1px 1px 2px #000",
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          Task details
        </h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          style={{ width: "100%", marginBottom: "10px" }}
        ></input>
        <textarea //Teaxtare för att ange en uppgiftsbeskrivning
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivning"
          style={{ width: "100%", height: "100px" }}
        />
        <div //knappsektion med tre knappar för spara delete och avbryt
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={handleSave}>Spara</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
