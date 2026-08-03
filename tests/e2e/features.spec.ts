// ============================================================================
// e2e/features.spec.ts — Testa novas features (templates, share)
// ============================================================================
import { test, expect } from "@playwright/test";

test.describe("Template Gallery — /templates", () => {
  test("carrega com título correto", async ({ page }) => {
    await page.goto("/templates");
    await expect(page).toHaveTitle(/Templates/);
  });

  test("mostra presets do catálogo", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");
    // Deve ter pelo menos 10 presets (catálogo tem 50+)
    const presetCards = page.locator("a[href*='/?preset=']");
    await expect(presetCards.first()).toBeVisible({ timeout: 10_000 });
    const count = await presetCards.count();
    expect(count).toBeGreaterThan(10);
  });

  test("mostra categorias", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");
    // Categorias devem aparecer
    const portfolioSection = page.getByText(/Portfolio/i).first();
    await expect(portfolioSection).toBeVisible({ timeout: 10_000 });
  });

  test("clicar num preset leva ao Forge com preset query", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");
    const firstPreset = page.locator("a[href*='/?preset=']").first();
    const href = await firstPreset.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/preset=/);
  });
});

test.describe("Share Pack — /share/[slug]", () => {
  test("slug inexistente mostra 404", async ({ page }) => {
    const res = await page.goto("/share/slug-que-nao-existe");
    // Deve retornar 404 (not found)
    expect(res?.status()).toBe(404);
  });
});

test.describe("Pack Versions API", () => {
  test("GET /api/v1/packs/[packId]/versions sem auth rejeita", async ({ request }) => {
    const res = await request.get("/api/v1/packs/pack-inexistente/versions");
    // 404 (pack não existe), 403 (sem permissão) ou 429 (rate limit em testes densos)
    expect([403, 404, 429]).toContain(res.status());
  });
});

test.describe("Share Pack API", () => {
  test("POST /api/v1/packs/share/[packId] sem auth rejeita", async ({ request }) => {
    const res = await request.post("/api/v1/packs/share/pack-inexistente", {
      data: { public: true },
    });
    // 404 (pack não existe), 403 (sem permissão) ou 429 (rate limit em testes densos)
    expect([403, 404, 429]).toContain(res.status());
  });
});
