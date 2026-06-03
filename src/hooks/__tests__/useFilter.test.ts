import { renderHook, act } from "@testing-library/react";
import { useFilter } from "../useFilter";

const mockTasks = [
  { id: "1", title: "React学習", priority: "high", status: "todo", labels: ["frontend"] },
  { id: "2", title: "API設計", priority: "medium", status: "in_progress", labels: ["backend"] },
  { id: "3", title: "テスト追加", priority: "low", status: "done", labels: ["frontend", "testing"] },
  { id: "4", title: "デプロイ準備", priority: "high", status: "todo", labels: ["devops"] },
];