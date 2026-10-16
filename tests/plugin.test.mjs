// Structural checks for the plugin. No dependencies: Node's own test runner.
// Run with `npm test`. CI also runs `claude plugin validate . --strict`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8").replace(/\r\n/g, "\n");
const readJson = (path) => JSON.parse(read(path));

const NAME = "reductionism-vs-systems-thinking";
const REPO = `https://github.com/ardaasaroglu/${NAME}`;
const SKILLS = ["decide", "practice"];
const AGENTS = ["reductionist", "systems-thinker"];
const DOMAINS = ["Clear", "Complicated", "Complex", "Chaotic", "Confusion"];
const CASES = ["annual-discount", "onboarding-steps", "referral-reward", "support-chatbot"];
const CASE_DIR = "skills/practice/references/cases";
const CREDIT = "Cynefin is Dave Snowden's framework. This project is independent and not affiliated with The Cynefin Company.";
const CARD_SECTIONS = [
  "# Tradeoff card: ",
  "* **The call:** ",
  "* **Domain:** ",
  "* **Who leads:** ",
  "* **What we give up:** ",
  "* **Revisit when:** ",
  "## Reductionism (zoom in)",
  "## Systems thinking (zoom out)",
  "| Loop | Type | Links | Delay | Who reacts and why | Signal to watch |",
  "## The clash",
  "## The call",
  "## Assumptions to check",
];

// Minimal frontmatter reader: `key: value` lines between the first two `---` lines.
function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "file starts with a frontmatter block");
  const fields = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return fields;
}

// The text from an open marker to the next close marker, markers included.
function block(text, open, close) {
  const start = text.indexOf(open);
  if (start < 0) return null;
  const end = text.indexOf(close, start);
  if (end < 0) return null;
  return text.slice(start, end + close.length);
}

// Rows of every Markdown table whose header starts with the given cells.
function tableRows(text, header) {
  const lines = text.split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith(header)) continue;
    for (let j = i + 2; j < lines.length && lines[j].startsWith("|"); j++) {
      rows.push(lines[j].split("|").slice(1, -1).map((c) => c.trim()));
    }
  }
  return rows;
}

// Every file in the repository, as paths relative to the root.
function allFiles(dir = root) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules"].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...allFiles(full));
    else out.push(relative(root, full).split(sep).join("/"));
  }
  return out;
}
const TEXT = /\.(md|json|ya?ml|mjs|js|txt)$|^\.(gitignore|editorconfig)$|^LICENSE$/;
const shippedTextFiles = () => allFiles().filter((f) => TEXT.test(f.split("/").pop()));

test("manifests parse and agree on name and version", () => {
  const plugin = readJson(".claude-plugin/plugin.json");
  const market = readJson(".claude-plugin/marketplace.json");
  const pkg = readJson("package.json");

  assert.equal(plugin.name, NAME);
  assert.equal(plugin.displayName, "Reductionism vs Systems Thinking");
  assert.equal(market.name, NAME);
  assert.equal(market.plugins.length, 1);
  assert.equal(market.plugins[0].name, plugin.name);
  assert.equal(market.plugins[0].source, "./");
  assert.equal(market.plugins[0].version, undefined, "version lives in plugin.json only");

  assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.version, plugin.version, "package.json version");
  assert.equal(pkg.private, true);
  assert.equal(pkg.dependencies, undefined, "no dependencies");
  assert.ok(!existsSync(join(root, "package-lock.json")), "no lockfile");
  const changelog = read("CHANGELOG.md").match(/^## (\d+\.\d+\.\d+)/m);
  assert.ok(changelog, "CHANGELOG.md has a version heading");
  assert.equal(changelog[1], plugin.version, "newest CHANGELOG.md entry");

  assert.equal(plugin.license, "MIT");
  assert.equal(plugin.author.name, "Arda Asaroglu");
  assert.equal(market.owner.name, "Arda Asaroglu");
  for (const k of ["systems-thinking", "reductionism", "cynefin", "product-management", "decision-making", "tradeoffs", "mental-models"]) {
    assert.ok(plugin.keywords.includes(k), `keyword ${k}`);
  }
});

test("directory fields are https URLs to this repository", () => {
  const plugin = readJson(".claude-plugin/plugin.json");
  for (const key of ["homepage", "repository", "documentationUrl", "supportUrl", "privacyPolicyUrl"]) {
    assert.ok(plugin[key]?.startsWith(REPO), `plugin.json ${key}`);
    assert.equal(new URL(plugin[key]).protocol, "https:", `${key} is https`);
  }
  assert.ok(existsSync(join(root, "PRIVACY.md")), "the privacy policy the manifest links to exists");
});

test("the icon is a small PNG", () => {
  const plugin = readJson(".claude-plugin/plugin.json");
  assert.match(plugin.icon, /^\.\/.+\.png$/, "icon is a PNG inside the plugin");
  const icon = readFileSync(join(root, plugin.icon));
  assert.equal(icon.subarray(1, 4).toString("latin1"), "PNG", "icon file is a PNG");
  assert.ok(icon.length < 64 * 1024, "icon under 64 KiB");
});

test("skills have valid frontmatter", () => {
  for (const name of SKILLS) {
    const text = read(`skills/${name}/SKILL.md`);
    const fm = frontmatter(text);
    assert.equal(fm.name, name, `${name}: name matches the folder`);
    assert.match(fm.description, /Use when/, `${name}: description says when to use it`);
    assert.ok(fm["argument-hint"], `${name}: argument-hint is set`);
    assert.ok(fm["allowed-tools"], `${name}: allowed-tools is set`);
    assert.equal(fm.model, undefined, `${name}: never pins a model`);
    assert.doesNotMatch(text, /\$ARGUMENTS/, `${name}: no placeholder that chat would show literally`);
    assert.ok(text.split("\n").length <= 250, `${name}: SKILL.md is 250 lines or fewer`);
  }
  const decide = frontmatter(read("skills/decide/SKILL.md"));
  assert.deepEqual(decide["allowed-tools"].split(/[\s,]+/).sort(), ["Agent", "Glob", "Grep", "Read"]);
});

test("every reference file a skill names exists in its folder", () => {
  for (const name of SKILLS) {
    const text = read(`skills/${name}/SKILL.md`);
    const named = new Set([...text.matchAll(/references\/([\w/-]+\.md)/g)].map((m) => m[1]));
    assert.ok(named.size > 0, `${name}: names its reference files`);
    for (const file of named) {
      assert.ok(existsSync(join(root, "skills", name, "references", file)), `skills/${name}/references/${file} exists`);
    }
  }
  const decide = read("skills/decide/SKILL.md");
  for (const file of ["lenses.md", "card-template.md", "archetypes.md"]) assert.ok(decide.includes(`references/${file}`), `decide names ${file}`);
  for (const agent of AGENTS) assert.ok(decide.includes(`${NAME}:${agent}`), `decide launches ${agent}`);
  const practice = read("skills/practice/SKILL.md");
  for (const c of CASES) assert.ok(practice.includes(`references/cases/${c}.md`), `practice names ${c}`);
  assert.ok(practice.includes("references/rubric.md"), "practice names the rubric");
});

test("agents have read-only tools, inherit the model, and carry their lens card word for word", () => {
  const files = readdirSync(join(root, "agents")).filter((f) => f.endsWith(".md"));
  assert.deepEqual(files.map((f) => f.replace(/\.md$/, "")).sort(), [...AGENTS].sort(), "no stray agent files");
  const lenses = read("skills/decide/references/lenses.md");
  for (const name of AGENTS) {
    const text = read(`agents/${name}.md`);
    const fm = frontmatter(text);
    assert.equal(fm.name, name, `${name}: name matches the file`);
    assert.match(fm.description, new RegExp(`lens for /${NAME}:decide`), `${name}: description`);
    assert.equal(fm.tools, "Read, Grep, Glob", `${name}: read-only tools`);
    assert.equal(fm.model, "inherit", `${name}: model inherits`);
    const card = block(lenses, `<!-- lens:${name} -->`, "<!-- /lens -->");
    assert.ok(card, `lenses.md has the ${name} card`);
    assert.equal(block(text, `<!-- lens:${name} -->`, "<!-- /lens -->"), card, `agents/${name}.md card matches lenses.md`);
  }
});

test("lenses.md has the full referee and the credit line", () => {
  const lenses = read("skills/decide/references/lenses.md");
  for (const d of DOMAINS) assert.match(lenses, new RegExp(`\\b${d}\\b`), `names ${d}`);
  for (const t of ["Separability", "Feedback with delay", "Reactors", "Shared things", "Time horizon", "Reversibility"]) {
    assert.ok(lenses.includes(t), `names ${t}`);
  }
  for (const call of ["Go", "Go with guardrails", "Redesign", "Don't"]) assert.ok(lenses.includes(`**${call}**`), `call ${call}`);
  assert.ok(lenses.includes(CREDIT), "lenses.md credits Cynefin");
  assert.ok(read("README.md").includes(CREDIT), "README credits Cynefin");
});

test("both archetype copies are identical and list eight archetypes", () => {
  const a = read("skills/decide/references/archetypes.md");
  assert.equal(read("skills/practice/references/archetypes.md"), a);
  assert.equal((a.match(/^## /gm) ?? []).length, 8);
});

test("each case is a complete card with a consistent domain and leader", () => {
  const template = read("skills/decide/references/card-template.md");
  for (const s of CARD_SECTIONS) assert.ok(template.includes(s), `card-template.md has ${s}`);
  const index = read(`${CASE_DIR}/README.md`);
  for (const c of CASES) {
    const text = read(`${CASE_DIR}/${c}.md`);
    for (const s of CARD_SECTIONS) assert.ok(text.includes(s), `${c}: has ${s}`);
    assert.ok(text.indexOf("<!-- solution") > text.indexOf("## The situation"), `${c}: situation comes before the solution marker`);
    assert.ok(text.indexOf("# Tradeoff card: ") > text.indexOf("<!-- solution"), `${c}: card comes after the marker`);
    assert.ok((text.match(/```mermaid/g) ?? []).length >= 2, `${c}: two Mermaid blocks`);
    const domain = text.match(/^\* \*\*Domain:\*\* (\w+) \(Cynefin\)/m)?.[1];
    assert.ok(DOMAINS.includes(domain), `${c}: Domain line names a Cynefin domain`);
    const leads = text.match(/^\* \*\*Who leads:\*\* (.+)$/m)[1];
    if (domain === "Complex") assert.match(leads, /^Systems thinker\b/, `${c}: Complex means the Systems thinker leads`);
    if (domain === "Complicated") assert.match(leads, /^Reductionist\b/, `${c}: Complicated means the Reductionist leads`);
    if (domain === "Confusion") assert.ok(/^split/i.test(leads) && leads.includes("Reductionist") && leads.includes("Systems thinker"), `${c}: Confusion splits the lead`);
    const row = index.split("\n").find((l) => l.includes(`(${c}.md)`));
    assert.ok(row, `cases/README.md lists ${c}`);
    assert.equal(row.split("|")[3].trim(), domain, `cases/README.md domain for ${c}`);
  }
  const files = readdirSync(join(root, CASE_DIR)).filter((f) => f !== "README.md").map((f) => f.replace(/\.md$/, ""));
  assert.deepEqual(files.sort(), [...CASES].sort(), "no stray case files");
});

test("every loop closes, and its R or B matches its count of negative links", () => {
  for (const c of CASES) {
    const rows = tableRows(read(`${CASE_DIR}/${c}.md`), "| Loop | Type | Links |");
    assert.ok(rows.length >= 2, `${c}: at least two loops`);
    for (const [loop, type, links] of rows) {
      const parsed = [...links.matchAll(/(?:^|, )(.+?) -> (.+?) \(([+-])\)/g)].map((m) => ({ from: m[1], to: m[2], sign: m[3] }));
      assert.ok(parsed.length >= 2, `${c} ${loop}: at least two links`);
      for (let i = 0; i < parsed.length; i++) {
        assert.equal(parsed[i].to, parsed[(i + 1) % parsed.length].from, `${c} ${loop}: link ${i + 1} leads into the next, and the last closes the loop`);
      }
      const negatives = (links.match(/\(-\)/g) ?? []).length;
      assert.equal(negatives, parsed.filter((l) => l.sign === "-").length, `${c} ${loop}: every sign is parsed`);
      assert.equal(type, negatives % 2 === 0 ? "R" : "B", `${c} ${loop}: ${negatives} negative links means ${negatives % 2 === 0 ? "R" : "B"}`);
    }
  }
});

test("ROADMAP.md ranks all 24 pairs with valid statuses", () => {
  const rows = tableRows(read("ROADMAP.md"), "| # | Pair |");
  assert.deepEqual(rows.map((r) => Number(r[0])), Array.from({ length: 25 }, (_, i) => i), "rows 0 to 24 in order");
  for (const r of rows) {
    const n = Number(r[0]);
    const want = n === 0 ? "Shipped 0.1.0" : n <= 7 ? "Planned" : "Candidate";
    assert.equal(r.at(-1), want, `row ${n} status`);
    assert.ok(r[3].length > 0, `row ${n} has sources`);
  }
  const roadmap = read("ROADMAP.md");
  assert.ok(roadmap.includes(`${REPO}/issues?q=label%3Aroadmap`), "voting link");
  assert.ok(roadmap.includes(`${REPO}/issues/new?template=approach-proposal.yml`), "proposal link");
  assert.ok(existsSync(join(root, ".github/ISSUE_TEMPLATE/approach-proposal.yml")), "proposal form exists");
});

test("the README works as the directory listing", () => {
  const readme = read("README.md");
  const prose = readme.replace(/```[\s\S]*?```/g, " ");
  assert.ok(prose.split(/\s+/).filter(Boolean).length >= 40, "40 words or more outside code blocks");
  assert.doesNotMatch(readme, /<img\b/i, "no HTML img tags");
  const prompts = readme.split("## Example prompts")[1]?.split("\n## ")[0] ?? "";
  assert.ok(prompts.split("\n").filter((l) => /^\* /.test(l)).length >= 4, "at least four example prompts");
  for (const r of tableRows(read("ROADMAP.md"), "| # | Pair |")) assert.ok(readme.includes(`| ${r[0]} | ${r[1]} |`), `README lists pair ${r[0]}`);
  assert.ok(readme.includes("(ROADMAP.md)"), "README links ROADMAP.md");
  assert.ok(readme.includes(`${REPO}/issues/new?template=approach-proposal.yml`), "README links the proposal form");
  for (const c of CASES) assert.ok(readme.includes(`${CASE_DIR}/${c}.md`), `README gallery links ${c}`);
  for (const author of ["Meadows", "Senge", "Minto", "Fermi", "Snowden and Boone"]) assert.ok(readme.includes(author), `credits ${author}`);
});

test("the plugin folder meets the directory's file rules", () => {
  const files = allFiles();
  assert.ok(files.length <= 512, "512 files or fewer");
  assert.ok(!existsSync(join(root, "bin")), "no top-level bin/");
  assert.ok(!existsSync(join(root, ".gitattributes")), "no .gitattributes");
  for (const rel of files) {
    assert.ok(statSync(join(root, rel)).size < 256 * 1024, `${rel}: under 256 KiB`);
    assert.doesNotMatch(rel, /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX)$/, `${rel}: no system files`);
  }
});

// Built from code points so this file stays ASCII: en dash and em dash.
const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

test("shipped text has no em or en dashes", () => {
  const offenders = shippedTextFiles().filter((f) => DASHES.test(read(f)));
  assert.deepEqual(offenders, []);
});

test("shipped text keeps local paths, emails, keys and the old name out", () => {
  const patterns = [
    [/[A-Za-z]:[\\/]Users[\\/]/, "a local Windows user path"],
    [/\/(?:Users|home)\/[a-z][\w.-]*\//, "a local home path"],
    [/[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}\b/i, "an email address"],
    [/sk-ant-[\w-]{8,}|ghp_\w{20,}|github_pat_\w{20,}|xox[bp]-\w+|AKIA[0-9A-Z]{16}/, "something shaped like a real key"],
    // Built from pieces so this file does not contain the phrase it bans.
    [new RegExp(["Parts", "and", "Loops"].join(" "), "i"), "the old working name"],
    // Built from code points so this file stays ASCII: G, S and I with breve, cedilla or dot.
    [new RegExp(`[${String.fromCharCode(0x11e, 0x11f, 0x15e, 0x15f, 0x130, 0x131)}]`), "letters from a non-English alphabet"],
  ];
  const problems = [];
  for (const file of shippedTextFiles()) {
    const text = read(file);
    for (const [re, what] of patterns) if (re.test(text)) problems.push(`${file}: ${what}`);
  }
  assert.deepEqual(problems, []);
});
