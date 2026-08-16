import { expect, test } from "@playwright/test";

test("home nav Projets scrolls to featured projects", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Gabriel Luthun", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Projets", exact: true }).click();
  await expect(page).toHaveURL(/#projets$/);
  await expect(page.getByRole("heading", { name: "Projets phares" })).toBeVisible();
});

test("catalog lists featured and training projects and opens MaxTracker", async ({ page }) => {
  await page.goto("./projets/");
  await expect(page.getByRole("link", { name: /MaxTracker/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Geekment/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Hub des Savoirs/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Monster Slayer/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Bots Discord Simplon/ })).toBeVisible();
  await page.getByRole("link", { name: /MaxTracker/ }).click();
  await expect(page).toHaveURL(/\/projets\/maxtracker\/?$/);
  await expect(page.getByRole("heading", { name: "MaxTracker" })).toBeVisible();
});

test("MaxTracker has a demo link and Geekment does not", async ({ page }) => {
  await page.goto("./projets/maxtracker/");
  await expect(page.getByRole("link", { name: "Voir la démo" })).toBeVisible();

  await page.goto("./projets/geekment-votre/");
  await expect(page.getByRole("heading", { name: "Geekment Vôtre" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voir la démo" })).toHaveCount(0);
  await expect(page.locator("article").getByRole("link", { name: "GitHub" })).toBeVisible();
});

test("unknown route shows the French 404 page", async ({ page }) => {
  const response = await page.goto("./page-inexistante/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /404|introuvable|existe/i })).toBeVisible();
});
