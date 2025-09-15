import { createContext } from "react";
import type { Column, Task } from "../Types/Types";

//Definerar ett interface med typen av det context som ska delas
interface TaskContextType {
  columns: Column[]; //Lista med kolumner innehåller uppgifter
  addTask: (ColumnId: string, task: Task) => void; //funktion lägger till uppgoft i en specifik kolumn
  updateTask: (ColumnId: string, taskId: string, updatedTask: Task) => void; //Funktoin uppdaterar en specifik uppgift i en kolumn
  deleteTask: (ColumnId: string, taskId: string) => void; //funktioj  för att a bort uppgift i kolumn
  moveTask: (
    sourceColumnId: string, //KolumnId där uppgiften  nu finns
    targetColumnId: string, //Kolumnid dit uppgiften ska flyttas
    taskId: string //Id för uppgiften som ska flyttas
  ) => void; //Funktion för att flytta uppgift mellan kolumner
}

//Skapa en react context för taskcontect med en defaultvärde av undefined
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);
