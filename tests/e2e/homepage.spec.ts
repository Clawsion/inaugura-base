// ============================================================================
// e2e/homepage.spec.ts — Smoke test: homepage carrega e tem elementos chave
// ============================================================================
import { test, expect } from "@playwright/test";

test.describe("Homepage — Inaugura-Base", () => {
  test("carrega com título correto", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Inaugura-Base/);
  });

  test("mostra o modo SimpleForge por defeito", async ({ page }) => {
    await page.goto("/");
    // Aguarda o formulário carregar
    await page.waitForLoadState("networkidle");
    // Deve ter o campo de briefing
    const briefing = page.locator("textarea").first();
    await expect(briefing).toBeVisible({ timeout: 10_000 });
  });

  test("tem paletes de cores visíveis", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Procura por botões com nome de paletes (Electric Lavender, etc.)
    const paletteCard = page.getByText(/Electric Lavender|Terminal Green|Sunset Coral/i).first();
    await expect(paletteCard).toBeVisible({ timeout: 10_000 });
  });

  test("tem botões de estilo de geração", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Deve mostrar pelo menos alguns botões de estilo
    const styleBtn = page.getByText(/Awwwards|Premium SaaS|Editorial/i).first();
    await expect(styleBtn).toBeVisible({ timeout: 10_000 });
  });

  test("tem botões de tipo de polimento", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Procura por botões de polimento
    const polishBtn = page.getByText(/^Jewel$|^Cream$|^Vivid$|^Dark Premium$/i).first();
    await expect(polishBtn).toBeVisible({ timeout: 10_000 });
  });

  test("botão Generate está visível", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const generateBtn = page.getByRole("button", { name: /Generate/i }).first();
    await expect(generateBtn).toBeVisible({ timeout: 10_000 });
  });

  test("botão Polimento está visível", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const polishBtn = page.getByRole("button", { name: /Polimento/i }).first();
    await expect(polishBtn).toBeVisible({ timeout: 10_000 });
  });
});
