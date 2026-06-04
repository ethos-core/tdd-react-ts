import { test, expect } from "@playwright/test";

test.describe("Form operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Add Task/i }).click();
  });

  test("required field validation", async ({ page }) => {
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Title is required")).toBeVisible();
    await expect(page.getByLabel("Title")).toBeFocused();
  });

  test("max length validation", async ({ page }) => {
    const longText = "a".repeat(101);
    await page.getByLabel("Title").fill(longText);
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Title must be 100 characters or less")).toBeVisible();
  });

  test("fills all fields and submits", async ({ page }) => {
    await page.getByLabel("Title").fill("New Task");
    await page.getByLabel("Description").fill("Detailed description here");
    await page.getByLabel("Priority").selectOption("high");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("New Task")).toBeVisible();

    await page.getByRole("button", { name: /Add Task/i }).click();
    await expect(page.getByLabel("Title")).toHaveValue("");
  });

  test("navigates form elements in order with Tab key", async ({ page }) => {
    await page.getByLabel("Title").focus();
    await expect(page.getByLabel("Title")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Description")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Priority")).toBeFocused();
  });

  test("closes the form on cancel", async ({ page }) => {
    await page.getByLabel("Title").fill("Cancel test");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByLabel("Title")).not.toBeVisible();
  });
});
