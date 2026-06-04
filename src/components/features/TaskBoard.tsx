import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
}

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function createTask(data: TaskFormData): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, status: "todo" }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}

export function TaskBoard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleteTarget(null);
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>An error occurred</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  const filtered = (tasks ?? []).filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = (status: string) =>
    filtered.filter((t) => t.status === status);

  return (
    <div>
      <div className="top-bar">
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add Task
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showForm && (
        <BoardTaskForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="board">
        <TaskColumn title="Todo" testId="column-todo" tasks={tasksByStatus("todo")} onDelete={setDeleteTarget} />
        <TaskColumn title="In Progress" testId="column-in_progress" tasks={tasksByStatus("in_progress")} onDelete={setDeleteTarget} />
        <TaskColumn title="Done" testId="column-done" tasks={tasksByStatus("done")} onDelete={setDeleteTarget} />
      </div>

      {deleteTarget && (
        <div className="dialog-overlay" role="dialog">
          <div className="dialog">
            <p>Are you sure you want to delete this task?</p>
            <div className="dialog-actions">
              <button className="btn-danger" onClick={() => deleteMutation.mutate(deleteTarget)}>
                Confirm Delete
              </button>
              <button onClick={() => setDeleteTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskColumn({
  title,
  testId,
  tasks,
  onDelete,
}: {
  title: string;
  testId: string;
  tasks: Task[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="column" data-testid={testId}>
      <h3>{title}</h3>
      {tasks.map((task) => (
        <div key={task.id} className="task-card" data-testid="task-card">
          <span>{task.title}</span>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function BoardTaskForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const validate = (): boolean => {
    if (title.trim() === "") {
      setError("Title is required");
      return false;
    }
    if (title.length > 100) {
      setError("Title must be 100 characters or less");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      titleRef.current?.focus();
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setError("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      <div className="form-group">
        <label htmlFor="board-task-title">Title</label>
        <input
          ref={titleRef}
          id="board-task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={error ? "board-title-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p id="board-title-error" className="error-text" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="board-task-description">Description</label>
        <textarea
          id="board-task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="board-task-priority">Priority</label>
        <select
          id="board-task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" className="btn-primary">Add</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
