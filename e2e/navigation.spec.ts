import { test, expect } from "@playwright/test";

test.describe("Page navigation", () => {
  test("displays the top page correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/TaskFlow/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "TaskFlow"
    );
  });

  test("navigates to each page via navigation links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(
      page.getByRole("heading", { name: "Projects" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(
      page.getByRole("heading", { name: "Settings" })
    ).toBeVisible();
  });

  test("displays a 404 page for non-existent paths", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Page not found")
    ).toBeVisible();
  });

  test("browser back button works correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects/);

    await page.goBack();
    await expect(page).toHaveURL("/");
  });
});
