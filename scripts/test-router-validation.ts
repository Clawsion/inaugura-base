// Validação rápida do router e validatePack em runtime
import { recommend, validatePack } from "../src/lib/router";
import type { GenerateInput } from "../src/lib/schema/inaugura-pack";

const input: GenerateInput = {
  locale: "pt",
  brief: "SaaS com Stripe e login",
  project_type: "saas",
  references: [],
  features: [],
  sections_lock: [],
  effects_lock: [],
  visual: { locks: { aesthetic: "modern-clean", mood: "premium", palette: "auto" } },
  execution: { mode: "auto", cost_profile: "free_open", host_preference: "opencode" },
  locks: { skills: [], mcps: [], integrations: [] },
  level: "pro",
  options: { polish_design: false, include_opencode_json: true, include_zip_markdown: true },
} as GenerateInput;

const rec = recommend(input);

console.log("=== ROUTER RESULT ===");
console.log(`Mode: ${rec.mode}`);
console.log(`Team functions: ${rec.team_functions.join(", ")}`);
console.log(`Integrations: ${rec.integrations.join(", ")}`);
console.log(`MCPs essential: ${rec.mcps_essential.join(", ")}`);
console.log(`Skills project: ${rec.skills_project.join(", ")}`);
console.log(`\n=== BUILD ROUTING (R9: free_open deve ter só modelos open) ===`);
rec.build_routing.forEach(r => {
  console.log(`  ${r.function_id.padEnd(20)} → ${r.model_id}`);
});

console.log(`\n=== VALIDATE PACK (testar rejeição de modelo inventado) ===`);
const fakePack = {
  meta: { cost_profile: "free_open" },
  routing: { build_routing: [{
    function_id: "architect", model_id: "claude-opus-4-5", host: "opencode", skills: [], mcps: []
  }]},
};
const result = validatePack(fakePack, rec);
console.log(`OK: ${result.ok}`);
console.log(`Errors: ${result.errors.length}`);
result.errors.forEach(e => console.log(`  - ${e}`));
