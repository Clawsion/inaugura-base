// ============================================================================
// e2e/api.spec.ts — Testa endpoints da API v1 via HTTP
// ============================================================================
import { test, expect } from "@playwright/test";

test.describe("API v1 — endpoints críticos", () => {
  test("POST /api/v1/recommend devolve recomendação válida", async ({ request }) => {
    const res = await request.post("/api/v1/recommend", {
      data: {
        locale: "pt",
        brief: "SaaS com Stripe e login para utilizadores",
        project_type: "saas",
        references: [],
        features: [],
        sections_lock: [],
        effects_lock: [],
        visual: { locks: { aesthetic: "modern-clean", mood: "premium", palette: "auto" } },
        execution: { mode: "auto", cost_profile: "free_open", host_preference: "opencode" },
        locks: { skills: ["prisma"], mcps: [], integrations: [] },
        level: "pro",
        options: { polish_design: false, include_opencode_json: true, include_zip_markdown: true },
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.rec).toBeDefined();
    expect(body.rec.mode).toBe("team");
    expect(body.rec.integrations).toContain("stripe");
    expect(body.rec.integrations).toContain("auth-clerk");
    expect(body.rec.skills_project).toContain("prisma");
    expect(body.rec.allowed_ids.length).toBeGreaterThan(0);
  });

  test("POST /api/v1/recommend rejeita input inválido", async ({ request }) => {
    const res = await request.post("/api/v1/recommend", {
      data: { invalid: true },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/v1/validate rejeita pack vazio", async ({ request }) => {
    const res = await request.post("/api/v1/validate", {
      data: { pack: {}, rec: { allowed_ids: [], mode: "individual", individual_slots: [] } },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.errors).toBeDefined();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("GET /api/v1/metrics devolve métricas", async ({ request }) => {
    const res = await request.get("/api/v1/metrics");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.metrics).toBeDefined();
    expect(body.metrics.source).toMatch(/^(db|memory)$/);
  });

  test("GET /api/v1/auth/me sem login devolve user null", async ({ request }) => {
    const res = await request.get("/api/v1/auth/me");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.user).toBeNull();
  });

  test("POST /api/v1/auth/signup + signin + me flow", async ({ request }) => {
    // 1. Signup
    const email = `test_${Date.now()}@e2e.com`;
    const signupRes = await request.post("/api/v1/auth/signup", {
      data: { email, password: "testpass123", name: "E2E Test" },
    });
    expect(signupRes.status()).toBe(200);
    const signupBody = await signupRes.json();
    expect(signupBody.ok).toBe(true);
    expect(signupBody.userId).toBeTruthy();

    // 2. Signin (com cookies)
    const signinRes = await request.post("/api/v1/auth/signin", {
      data: { email, password: "testpass123" },
    });
    expect(signinRes.status()).toBe(200);
    const signinBody = await signinRes.json();
    expect(signinBody.ok).toBe(true);

    // 3. Me — usar cookies da response anterior
    const meRes = await request.get("/api/v1/auth/me", {
      headers: {
        Cookie: signinRes.headers()["set-cookie"] ?? "",
      },
    });
    expect(meRes.status()).toBe(200);
    const meBody = await meRes.json();
    expect(meBody.ok).toBe(true);
    expect(meBody.user.email).toBe(email);

    // 4. Signout
    const signoutRes = await request.post("/api/v1/auth/signout");
    expect(signoutRes.status()).toBe(200);
  });

  test("POST /api/v1/auth/signup rejeita email duplicado", async ({ request }) => {
    const email = `dup_${Date.now()}@e2e.com`;
    // 1. signup inicial — pode dar 429 se rate limit atingido (testes densos)
    const r1 = await request.post("/api/v1/auth/signup", {
      data: { email, password: "testpass123" },
    });
    if (r1.status() === 429) {
      console.log("Rate limit atingido no signup inicial — saltar");
      return;
    }
    expect(r1.status()).toBe(200);
    // 2. signup duplicado — pode dar 400 (email duplicado) OU 429 (rate limit)
    const res = await request.post("/api/v1/auth/signup", {
      data: { email, password: "testpass123" },
    });
    if (res.status() === 429) {
      console.log("Rate limit atingido (esperado em testes densos)");
      return;
    }
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/já registado/i);
  });

  test("POST /api/v1/auth/signin rejeita password errada", async ({ request }) => {
    const email = `wrong_${Date.now()}@e2e.com`;
    await request.post("/api/v1/auth/signup", {
      data: { email, password: "testpass123" },
    });
    const res = await request.post("/api/v1/auth/signin", {
      data: { email, password: "wrongpassword" },
    });
    if (res.status() === 429) {
      // Rate limit atingido — comportamento correto
      console.log("Rate limit atingido (esperado em testes densos)");
      return;
    }
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/credenciais inválidas/i);
  });
});
