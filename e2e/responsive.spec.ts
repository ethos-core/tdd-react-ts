import { test, expect, devices } from "@playwright/test";

test.describe("Responsive design", () => {
  test("shows hamburger menu on mobile", async ({ browser }) => {
    const context = await browser.newContext({
      ...devices["iPhone 14"],
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("sidebar")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Menu" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByTestId("sidebar")).toBeVisible();

    await context.close();
  });

  test("sidebar is collapsible on tablet", async ({ browser }) => {
    const context = await browser.newContext({
      ...devices["iPad (gen 7)"],
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("sidebar")).toBeVisible();
    await page.getByRole("button", { name: "Close sidebar" }).click();
    await expect(page.getByTestId("sidebar")).not.toBeVisible();

    await context.close();
  });

  test("screenshot comparison for each viewport width", { tag: "@visual" }, async ({ browser }) => {
    test.skip(!!process.env.CI, "Screenshot tests are skipped in CI due to rendering differences");
    const viewports = [
      { name: "mobile", width: 375, height: 812 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot(`responsive-${viewport.name}.png`);
      await context.close();
    }
  });
});

test.describe("Touch interactions", () => {
    test("can delete a task by swiping", async ({ browser }) => {
      const context = await browser.newContext({
        ...devices["iPhone 14"],
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
  
      const taskCard = page.getByTestId("task-card").first();
      const box = await taskCard.boundingBox();
      if (!box) throw new Error("Task card not found");
  
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 100, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
  
      await expect(
        page.getByRole("button", { name: "Delete", exact: true }).first()
      ).toBeVisible();
  
      await context.close();
    });
  });
