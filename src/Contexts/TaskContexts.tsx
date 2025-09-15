import React, { useState, type ReactNode } from "react";
import type { Column, Task } from "../Types/Types";
import { TaskContext } from "./Context";

//Initial data för kolumner och deras uppgifter
const initialData: Column[] = [
  {
    id: "todo",
    title: "Todo",
    tasks: [
      { id: "task-1", title: "Go to pilates" },
      { id: "task-2", title: "Fix skin routine" },
    ],
  },

  {
    id: "inprogress",
    title: "In Progress",
    tasks: [{ id: "task-3", title: "Solve debugging in codeassignment" }],
  },
  {
    id: "done",
    title: "Done",
    tasks: [{ id: "task-4", title: "Work out at the gym" }],
  },
];

//Typ för kolumnens data
export interface ColumnType {
  id: string;
  title: string;
}

//Egenskaper för taskprovider komponenten
interface TasksProviderProps {
  children: ReactNode;
}

//komponent som tillhandahåller taskcontext till sina barnkomponenter
export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  //State för kolumner och deras uppgifter
  const [columns, setColumns] = useState<Column[]>(initialData);

  //funktion för att addera en ny uppgift till en specifik kolumn
  const addTask = (columnId: string, task: Task) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      )
    );
  };

  //Funktion för att uppdatera en specifik uppgift i en kolumn
  const updateTask = (columnId: string, taskId: string, updateTask: Task) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.map((t: Task) => (t.id === taskId ? updateTask : t)),
        };
      })
    );
  };

  //Funktion för att ta bort en upppgift från en kolumn
  const deleteTask = (columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.filter((t: Task) => t.id !== taskId),
        };
      })
    );
  };

  //funktion för att flytta en uppgift
  const moveTask = (
    sourceColumn: string,
    targetColumnId: string,
    taskId: string
  ) => {
    //Variabel för att lagra uppgiften som ska flyttas
    let taskToMove: Task | undefined;
    //Uppdatera kolumnerna
    setColumns((prev) => {
      const newCols = prev.map((col) => {
        if (col.id === sourceColumn) {
          //Hämta upgift från ursprungskolumnen
          taskToMove = col.tasks.find((t: Task) => t.id === taskId);
          //Ta bort uppgiften från ursprungskolumnen
          return {
            ...col,
            tasks: col.tasks.filter((t: Task) => t.id !== taskId),
          };
        }
        return col;
      });
      //Lägg till uppgiften i vald kolumn
      return newCols.map((col) => {
        if (col.id === targetColumnId && taskToMove) {
          return {
            ...col,
            tasks: [...col.tasks, taskToMove],
          };
        }
        return col;
      });
    });
  };

  //Returnera context provider med alla funktioner och data
  return (
    <TaskContext.Provider
      value={{
        columns,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
