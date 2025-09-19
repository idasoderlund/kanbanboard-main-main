import React, { useState } from "react";
import type { Task } from "../Types/Types";
import { useDraggable } from "@dnd-kit/core";
import Modal from "./Modal";
import useMediaQuery from "../Hooks/UseMediaQuery";
import TaskDropdown from "./TaskDropDown";

//Definerar ts interface för props som cardkomponenten ska ta emot
interface Column {
  id: string;
  tasks?: Task[];
}

interface CardProps {
  task: Task;
  columnId: string;
  columnTasks: Task[];
  columns: Column[];
  onRequestDelete: () => void;
  onDeleteTask: (taskId: string) => void;
  onRequestOpen: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onMoveTask?: (task: Task, direction: "up" | "down") => void;
}

//React funktionn  komponent för ett uppgiftskort
const Card: React.FC<CardProps> = ({
  task,
  columnId,
  columns,
  //onRequestDelete,
  onDeleteTask,
  onRequestOpen,
  onUpdateTask,
  onMoveTask,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 769px)");
  //Använder draggable-hook för att göra elementet dragbart
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { columnId, task },
      disabled: true,
    });
  // Här skickas unika id:t task.id för dragobjekt och ytterligare data alltså columnid och task, händer över

  const [showDropDown, setShowDropDown] = useState(false);
  const [targetTask, setTargetTask] = useState<Task | null>(null);
  const [moveDirection, setMoveDirection] = useState<"up" | "down" | null>(
    null
  );
  const [selectedTasKForMove, setselectedTasKForMove] = useState<Task | null>(
    null
  );

  const handleClick = () => {
    if (!isSmallScreen) {
      onRequestOpen(task);
      //setShowModal(true);
    } else {
      onRequestOpen(task); //Hade handleOpenModal(); före!!!
    }
  };

  //State för modal hanteringen
  const [showModal, setShowModal] = useState(false);

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
      {isSmallScreen && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            display: "flex",
            gap: "4px",
          }}
        ></div>
      )}
      {showDropDown && selectedTasKForMove && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            zIndex: 1000,
            top: "50px", // exempel placering
            left: "50%", // exempel placering
            transform: "translateX(-50%)",
          }}
        >
          <div style={{ marginBottom: "10px" }}>move task</div>
          {columns[0].tasks?.map((taskOption: Task) => (
            <div
              key={taskOption.id}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor:
                  selectedTasKForMove?.id === taskOption.id
                    ? "#ddd"
                    : "transparent",
              }}
              onClick={() => {
                setselectedTasKForMove(taskOption);
              }}
            >
              {taskOption.title}
            </div>
          ))}
        </div>
      )}

      {showDropDown && (
        <TaskDropdown
          tasks={columns[0].tasks?.filter((t: Task) => t.id !== task.id) || []}
          onSelect={(task) => setTargetTask(task)}
          onClose={() => setShowDropDown(false)}
        />
      )}

      {targetTask && moveDirection && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => {
              if (onMoveTask) {
                onMoveTask(targetTask, moveDirection);
              }
              setShowDropDown(false);
              setTargetTask(null);
              setMoveDirection(null);
            }}
          >
            Confirm move here
          </button>

          <button
            onClick={() => {
              setShowDropDown(false);
              setTargetTask(null);
              setMoveDirection(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={handleClick}
      >
        {task.title}
      </div>
      {showModal && (
        <Modal
          task={task}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
};
export default Card;
