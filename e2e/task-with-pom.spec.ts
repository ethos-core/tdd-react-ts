import { test, expect } from "@playwright/test";
import { TaskBoardPage } from "./pages/TaskBoardPage";

test.describe("Task management (POM pattern)", () => {
  let board: TaskBoardPage;

  test.beforeEach(async ({ page }) => {
    board = new TaskBoardPage(page);
    await board.goto();
  });

  test("add and delete task flow", async () => {
    const initialCount = await board.getTaskCount();
    await board.addTask("POM test task", { priority: "high" });

    expect(await board.getTaskCount()).toBe(initialCount + 1);

    await board.deleteTask("POM test task");
    expect(await board.getTaskCount()).toBe(initialCount);
  });

  test("search filtering", async () => {
    await board.addTask("Frontend improvement");
    await board.addTask("Backend improvement");

    await board.searchTasks("Frontend");

    expect(await board.getTaskCount()).toBe(1);
  });
});
