import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Board from "./Components/Board.tsx";
import ColumnPage from "./Pages/ColumnPage.tsx";
import { TasksProvider } from "./Contexts/TaskContexts.tsx";
import "./App.css";

//Appfunktion med samlade komponenter samt -Navigering SPA
const App: React.FC = () => {
  return (
    <TasksProvider>
      <Router>
        <nav>
          <Link to="/">Back to board</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/column/:columnId" element={<ColumnPage />} />
        </Routes>
      </Router>
    </TasksProvider>
  );
};

export default App;
