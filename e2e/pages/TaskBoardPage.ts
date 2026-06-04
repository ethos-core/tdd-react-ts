import { type Page, type Locator, expect } from "@playwright/test";

export class TaskBoardPage {
  readonly page: Page;
  readonly addTaskButton: Locator;
  readonly searchInput: Locator;
  readonly themeToggle: Locator;
  readonly todoColumn: Locator;
  readonly inProgressColumn: Locator;
  readonly doneColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addTaskButton = page.getByRole("button", { name: /Add Task/i });
    this.searchInput = page.getByPlaceholder("Search...");
    this.themeToggle = page.getByRole("button", { name: /theme/i });
    this.todoColumn = page.getByTestId("column-todo");
    this.inProgressColumn = page.getByTestId("column-in_progress");
    this.doneColumn = page.getByTestId("column-done");
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async addTask(title: string, options?: { description?: string; priority?: string }) {
    await this.addTaskButton.click();
    await this.page.getByLabel("Title").fill(title);

    if (options?.description) {
      await this.page.getByLabel("Description").fill(options.description);
    }
    if (options?.priority) {
      await this.page.getByLabel("Priority").selectOption(options.priority);
    }

    await this.page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async deleteTask(title: string) {
    const taskCard = this.page.getByText(title).locator("xpath=ancestor::*[@data-testid='task-card']");
    await taskCard.getByRole("button", { name: /Delete/i }).click();
    await this.page.getByRole("button", { name: "Confirm Delete" }).click();
    await expect(this.page.getByText(title)).not.toBeVisible();
  }

  async moveTask(title: string, targetColumn: Locator) {
    const task = this.page.getByText(title);
    await task.dragTo(targetColumn);
  }

  async searchTasks(query: string) {
    await this.searchInput.fill(query);
  }

  async getTaskCount() {
    return await this.page.getByTestId("task-card").count();
  }

  async toggleDarkMode() {
    await this.themeToggle.click();
  }
}
