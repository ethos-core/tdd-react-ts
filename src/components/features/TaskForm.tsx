import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
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
    titleRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          ref={titleRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={error ? "title-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p id="title-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <button type="submit">Add Task</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
