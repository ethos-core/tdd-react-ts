import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("top page appearance", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("top-page.png");
  });

  test("dark mode appearance", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /theme/i }).click();
    await expect(page).toHaveScreenshot("dark-mode.png");
  });

  test("form open appearance", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Add Task/i }).click();
    await expect(page).toHaveScreenshot("form-open.png");
  });

  test("validation error appearance", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Add Task/i }).click();
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page).toHaveScreenshot("validation-error.png");
  });

  test("specific component screenshot", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.getByTestId("sidebar");
    await expect(sidebar).toHaveScreenshot("sidebar.png");
  });
});
