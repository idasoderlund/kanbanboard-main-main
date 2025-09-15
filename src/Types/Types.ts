//Egenskaper för en uppgift
export interface Task {
  id: string;
  title: string;
  description?: string;
}

//Typ för kolumnens data med egenskaper
export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
