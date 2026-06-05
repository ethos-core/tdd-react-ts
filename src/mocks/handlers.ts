import { http, HttpResponse, delay } from "msw";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  createdAt: string;
}

let tasks: Task[] = [
  {
    id: "1",
    title: "React コンポーネント設計",
    description: "再利用可能なコンポーネントを設計する",
    priority: "high",
    status: "todo",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "2",
    title: "API エンドポイント実装",
    description: "REST API を実装する",
    priority: "medium",
    status: "in_progress",
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "3",
    title: "テスト追加",
    description: "ユニットテストとE2Eテストを追加する",
    priority: "low",
    status: "done",
    createdAt: "2026-01-17T11:00:00Z",
  },
];

export function resetTasks() {
  tasks = [
    {
      id: "1",
      title: "React コンポーネント設計",
      description: "再利用可能なコンポーネントを設計する",
      priority: "high",
      status: "todo",
      createdAt: "2026-01-15T09:00:00Z",
    },
    {
      id: "2",
      title: "API エンドポイント実装",
      description: "REST API を実装する",
      priority: "medium",
      status: "in_progress",
      createdAt: "2026-01-16T10:00:00Z",
    },
    {
      id: "3",
      title: "テスト追加",
      description: "ユニットテストとE2Eテストを追加する",
      priority: "low",
      status: "done",
      createdAt: "2026-01-17T11:00:00Z",
    },
  ];
}

export const handlers = [
  // GET /api/tasks - タスク一覧取得
  http.get("/api/tasks", async () => {
    await delay(100);
    return HttpResponse.json(tasks);
  }),

  // GET /api/tasks/:id - タスク詳細取得
  http.get("/api/tasks/:id", async ({ params }) => {
    await delay(100);
    const task = tasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(task);
  }),

  // POST /api/tasks - タスク作成
  http.post("/api/tasks", async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as Partial<Task>;

    if (!body.title || body.title.trim() === "") {
      return HttpResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const newTask: Task = {
      id: String(Date.now()),
      title: body.title,
      description: body.description ?? "",
      priority: body.priority ?? "medium",
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PATCH /api/tasks/:id - タスク更新
  http.patch("/api/tasks/:id", async ({ params, request }) => {
    await delay(100);
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Partial<Task>;
    tasks[index] = { ...tasks[index], ...body };
    return HttpResponse.json(tasks[index]);
  }),

  // DELETE /api/tasks/:id - タスク削除
  http.delete("/api/tasks/:id", async ({ params }) => {
    await delay(100);
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    tasks.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];