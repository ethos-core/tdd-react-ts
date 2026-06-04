import { http, HttpResponse } from "msw";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup",
    description: "Set up the development environment",
    priority: "high",
    status: "done",
  },
  {
    id: "2",
    title: "Add tests",
    description: "Write unit tests",
    priority: "medium",
    status: "todo",
  },
];

let tasks = [...initialTasks];

export const handlers = [
  http.get("/api/tasks", () => {
    return HttpResponse.json(tasks);
  }),

  http.post("/api/tasks", async ({ request }) => {
    const body = (await request.json()) as Omit<Task, "id">;
    const newTask: Task = {
      ...body,
      id: String(Date.now()),
    };
    tasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const { id } = params;
    tasks = tasks.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch("/api/tasks/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Task>;
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    const updated = tasks.find((t) => t.id === id);
    return HttpResponse.json(updated);
  }),
];

export function resetTasks() {
  tasks = [...initialTasks];
}
