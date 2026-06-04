import { type Page, type Locator, expect } from "@playwright/test";

export class TaskFormPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByLabel("Title");
    this.descriptionInput = page.getByLabel("Description");
    this.prioritySelect = page.getByLabel("Priority");
    this.submitButton = page.getByRole("button", { name: "Add" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async fill(data: { title: string; description?: string; priority?: string }) {
    await this.titleInput.fill(data.title);
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    if (data.priority) {
      await this.prioritySelect.selectOption(data.priority);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectValidationError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
