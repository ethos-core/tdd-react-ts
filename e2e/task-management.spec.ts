import { test, expect } from "@playwright/test";

test.describe("Task management app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("can add a new task", async ({ page }) => {
    await page.getByRole("button", { name: /Add Task/i }).click();
    await page.getByLabel("Title").fill("My New Task");
    await page.getByLabel("Description").fill("Task description");
    await page.getByLabel("Priority").selectOption("high");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("My New Task")).toBeVisible();
  });

  test("can delete a task", async ({ page }) => {
    const deleteButton = page.getByTestId("task-card").first().getByRole("button", { name: "Delete" });
    await deleteButton.click();

    await expect(page.getByText("Are you sure you want to delete this task?")).toBeVisible();
    await page.getByRole("button", { name: "Confirm Delete" }).click();

    await expect(page.getByTestId("task-card")).toHaveCount(1);
  });

  test("can filter tasks by search", async ({ page }) => {
    await page.getByPlaceholder("Search...").fill("Setup");
    await expect(page.getByTestId("task-card")).toHaveCount(1);
  });

  test("can toggle dark mode", async ({ page }) => {
    await page.getByRole("button", { name: /theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
