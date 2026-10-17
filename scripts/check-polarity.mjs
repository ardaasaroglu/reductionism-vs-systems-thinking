#!/usr/bin/env node
// Checks the loops in every tradeoff card the model wrote during an eval run.
//
//   node scripts/check-polarity.mjs <result.json | results directory>
//
// Pass the file `claude plugin eval --json <path>` writes, or a results
// directory such as evals/results/<timestamp>/ to scan every .json and .jsonl
// file in it. Each loop must close, and its R or B label must match its count
// of negative links. Exit code 0 when every card passes, 1 when any card
// fails, 2 when the input cannot be read.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { LOOPS_HEADER, loopProblems } from "./loops.mjs";

// Walks a parsed document without depending on its exact shape: every string
// that holds a loops table is a card. A case is an object with a string `name`
// and an `arms` object (the documented result shape) or a `case` field; the
// keys under `arms` name the arm.
function* cards(node, where) {
  if (typeof node === "string") {
    if (node.includes(LOOPS_HEADER)) yield { ...where, text: node };
  } else if (Array.isArray(node)) {
    for (const item of node) yield* cards(item, where);
  } else if (node && typeof node === "object") {
    let here = where;
    if (typeof node.name === "string" && node.arms && typeof node.arms === "object") here = { ...where, label: node.name };
    else if (typeof node.case === "string") here = { ...where, label: node.case };
    for (const [key, value] of Object.entries(node)) {
      if (key === "arms" && value && typeof value === "object" && !Array.isArray(value)) {
        for (const [arm, runs] of Object.entries(value)) yield* cards(runs, { ...here, arm });
      } else {
        const arm = typeof node.arm === "string" ? node.arm : here.arm;
        yield* cards(value, { ...here, arm });
      }
    }
  }
}

function documents(input) {
  if (!statSync(input).isDirectory()) return [{ file: input, docs: [JSON.parse(readFileSync(input, "utf8"))] }];
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith(".json")) found.push({ file: path, docs: [JSON.parse(readFileSync(path, "utf8"))] });
      else if (entry.name.endsWith(".jsonl")) {
        const docs = [];
        for (const line of readFileSync(path, "utf8").split("\n")) {
          try {
            if (line.trim()) docs.push(JSON.parse(line));
          } catch {
            // a partial last line in a trace: skip it
          }
        }
        found.push({ file: path, docs });
      }
    }
  };
  walk(input);
  return found;
}

// Returns a Map of "case (arm)" to { cards, passed, problems }. The same card
// text found twice under one label counts once.
export function checkResult(...parsed) {
  return tally(parsed.map((doc) => ({ fallback: "unknown case", docs: [doc] })));
}

function tally(sources) {
  const seen = new Set();
  const byCase = new Map();
  for (const { fallback, docs } of sources) {
    for (const doc of docs) {
      for (const { label = fallback, arm, text } of cards(doc, {})) {
        const name = arm ? `${label} (${arm})` : label;
        const key = `${name}\n${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const problems = loopProblems(text);
        const entry = byCase.get(name) ?? { cards: 0, passed: 0, problems: [] };
        entry.cards += 1;
        if (problems.length === 0) entry.passed += 1;
        else entry.problems.push(...problems);
        byCase.set(name, entry);
      }
    }
  }
  return byCase;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = process.argv[2];
  if (!input) {
    console.error("usage: node scripts/check-polarity.mjs <result.json | results directory>");
    process.exit(2);
  }
  let sources;
  try {
    sources = documents(input).map(({ file, docs }) => ({ fallback: relative(input, file).split(sep).slice(0, -1).join("/") || file, docs }));
  } catch (error) {
    console.error(`cannot read ${input}: ${error.message}`);
    process.exit(2);
  }
  const byCase = tally(sources);
  if (byCase.size === 0) console.log("no tradeoff cards with a loops table found");
  let failed = 0;
  for (const [name, entry] of byCase) {
    console.log(`${name}: ${entry.passed} of ${entry.cards} cards pass`);
    for (const problem of entry.problems) console.log(`  ${problem}`);
    failed += entry.cards - entry.passed;
  }
  process.exit(failed > 0 ? 1 : 0);
}
