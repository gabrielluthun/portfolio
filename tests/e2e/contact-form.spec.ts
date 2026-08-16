import { expect, test } from "@playwright/test";

test("contact form succeeds when Web3Forms is intercepted", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "content-type,accept",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
      });
      return;
    }

    const body = route.request().postDataJSON() as Record<string, unknown>;
    expect(body.name).toBe("Ada Lovelace");
    expect(body.email).toBe("ada@example.com");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("./");
  const name = page.locator("#contact-name");
  await name.waitFor();

  await expect(async () => {
    await name.fill("Ada Lovelace");
    await expect(name).toHaveValue("Ada Lovelace");
  }).toPass();

  await page.locator("#contact-email").fill("ada@example.com");
  await page.locator("#contact-subject").fill("Projet web");
  await page.locator("#contact-message").fill(
    "Bonjour, je souhaite discuter d'un projet.",
  );
  await page.locator("#contact-consent").check();
  await page.getByRole("button", { name: "Discutons ensemble" }).click();

  await expect(page.getByRole("status")).toHaveText(
    "Votre message a bien été envoyé.",
  );
  await expect(page).toHaveURL(/\/portfolio\/?$/);
});
