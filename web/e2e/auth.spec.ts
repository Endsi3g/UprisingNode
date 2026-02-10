import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("Signup -> Login -> Dashboard", async ({ page }) => {
    // Generate a unique email
    const uniqueId = Date.now();
    const email = `user${uniqueId}@example.com`;
    const password = "Password123!";
    const name = `Test User ${uniqueId}`;

    // 1. Signup
    await page.goto("/signup");
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Check terms
    // The label is "J'accepte les termes et conditions..."
    // The input id is "terms"
    await page.check('input[id="terms"]');

    // Click submit
    await page.click('button[type="submit"]');

    // Wait for navigation to Dashboard
    // Note: In a real environment, this might be fast or slow.
    // The URL check handles the wait automatically.
    await expect(page).toHaveURL("/dashboard");

    // Verify dashboard content
    // Based on page.tsx: <PageHeader title="Dashboard" ... />
    // Assuming PageHeader renders an h1 or similar.
    // If not, we look for text "Dashboard".
    await expect(
      page.getByText("Dashboard", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Bienvenue dans le réseau Uprising"),
    ).toBeVisible();

    // 2. Logout and Login again to verify credentials
    // Finding logout button. It's usually in the sidebar or header.
    // Since I didn't see layout.tsx, I assume there is a way.
    // But for MVP, let's clear cookies to simulate logout.
    await page.context().clearCookies();

    await page.goto("/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });
});
