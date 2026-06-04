import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { TaskBoard } from "./components/features/TaskBoard";

function Sidebar({
  open,
  collapsed,
  onClose,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
}) {
  return (
    <nav
      data-testid="sidebar"
      className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
    >
      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/projects" onClick={onClose}>Projects</Link>
      <Link to="/settings" onClick={onClose}>Settings</Link>
    </nav>
  );
}

function ProjectsPage() {
  return (
    <div>
      <h2>Projects</h2>
      <p>Project list will appear here.</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Settings will appear here.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h2>404</h2>
      <p>Page not found</p>
    </div>
  );
}

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              Menu
            </button>
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="collapse-sidebar-btn"
            >
              Close sidebar
            </button>
            <h1>TaskFlow</h1>
          </div>
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light theme" : "Dark theme"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<TaskBoard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
