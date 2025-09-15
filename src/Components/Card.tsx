import React, { useState } from "react";
import type { Task } from "../Types/Types";
import { useDraggable } from "@dnd-kit/core";
import Modal from "./Modal";

//Definerar ts interface för props som cardkomponenten ska ta emot
interface CardProps {
  task: Task;
  columnId: string;
  onRequestDelete: () => void;
  onDeleteTask: (taskId: string) => void;
  onRequestOpen: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

//React funktionn  komponent för ett uppgiftskort
const Card: React.FC<CardProps> = ({
  task,
  columnId,
  onRequestDelete,
  onDeleteTask,
  onRequestOpen,
}) => {
  //Använder draggable-hook för att göra elementet dragbart
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { columnId, task } });
  // Här skickas unika id:t task.id för dragobjekt och ytterligare data alltså columnid och task

  //State för modal hanteringen
  const [showModal, setShowModal] = useState(false);

  //Funktion för öppna modal
  const handleOpenModal = () => {
    onRequestOpen(task);
    setShowModal(true);
  };

  //Funktion för att stänga modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Funktion för att spara ändringar i modal
  const handleSaveTask = (updatedTask: Task) => {
    //Här kan du använfa context för att uppdatera
    //Exempel antopa en funktion som skickas via props eller context
    onUpdateTask(updatedTask);
    setShowModal(false);
  };

  const handleDeleteTask = () => {
    onDeleteTask(task.id); //Anropar calback med task id
  };

  //Definera stil för kort
  const style = {
    //Använder transform värde för att flytta element under dragning
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    //Sänker opacitet när kortet dras för att visa att det är nyss draget
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: "#F7F7F7",
    padding: "8px",
    marginBottom: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    borderRadius: "4px",
  };

  //Renderar ett divelement som fugnerar som kortet
  //Använder ref för att koppla element till dragfunktionaliteten
  //Sprider ut lyssnare och attribut som krövs för dragfunktion
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={handleOpenModal}
      >
        {task.title}
      </div>
      {showModal && (
        <Modal
          task={task}
          onClose={handleCloseModal}
          onSave={(updatedTask) => {
            onRequestOpen(updatedTask);
          }}
          onDelete={() => {
            onDeleteTask(task.id);
          }}
        />
      )}
    </>
  );
};
export default Card;
