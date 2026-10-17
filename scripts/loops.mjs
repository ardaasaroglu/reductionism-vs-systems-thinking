// Checks the loops table of a tradeoff card: every loop must close, and its
// R or B label must match its count of negative links (even = R, odd = B).
// Shared by tests/plugin.test.mjs (the worked cases) and
// scripts/check-polarity.mjs (cards written by the model during evals).

export const LOOPS_HEADER = "| Loop | Type | Links |";

// A model may write a Unicode minus or an arrow; read them as their ASCII forms.
const MINUS = new RegExp(String.fromCharCode(0x2212), "g");
const ARROW = new RegExp(String.fromCharCode(0x2192), "g");

export function tableRows(text, header) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith(header)) continue;
    for (let j = i + 2; j < lines.length && lines[j].startsWith("|"); j++) {
      rows.push(lines[j].split("|").slice(1, -1).map((c) => c.trim()));
    }
  }
  return rows;
}

// Returns one message per problem. An empty list means every loop checks out.
export function loopProblems(text) {
  const rows = tableRows(text.replace(MINUS, "-").replace(ARROW, "->"), LOOPS_HEADER);
  if (rows.length === 0) return ["no loops table in the card format"];
  const problems = [];
  for (const [loop, type = "", links = ""] of rows) {
    const parsed = [...links.matchAll(/(?:^|, )(.+?) -> (.+?) \(([+-])\)/g)].map((m) => ({ from: m[1], to: m[2], sign: m[3] }));
    if (parsed.length < 2) {
      problems.push(`${loop}: fewer than two links could be read`);
      continue;
    }
    for (let i = 0; i < parsed.length; i++) {
      const next = parsed[(i + 1) % parsed.length];
      if (parsed[i].to !== next.from) problems.push(`${loop}: link ${i + 1} ends at "${parsed[i].to}" but the next link starts at "${next.from}"`);
    }
    const negatives = parsed.filter((l) => l.sign === "-").length;
    if ((links.match(/\(-\)/g) ?? []).length !== negatives) problems.push(`${loop}: a negative link could not be read`);
    const want = negatives % 2 === 0 ? "R" : "B";
    if (type.replace(/\*/g, "").trim() !== want) problems.push(`${loop}: ${negatives} negative links means ${want}, but it is labeled ${type}`);
  }
  return problems;
}
