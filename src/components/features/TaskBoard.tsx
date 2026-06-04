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

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add Task</button>

      {showForm && (
        <BoardTaskForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ul>
        {tasks?.map((task) => (
          <li key={task.id} data-testid="task-card">
            <span>{task.title}</span>
            <button onClick={() => setDeleteTarget(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {deleteTarget && (
        <div role="dialog">
          <p>Are you sure you want to delete this task?</p>
          <button onClick={() => deleteMutation.mutate(deleteTarget)}>
            Confirm Delete
          </button>
          <button onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      )}
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      <div>
        <label htmlFor="board-task-title">Title</label>
        <input
          ref={titleRef}
          id="board-task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="board-task-description">Description</label>
        <textarea
          id="board-task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
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

      <div>
        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
