// SPDX-License-Identifier: MIT
// Entry for "The Excuse Your Agent Gives You" (make.fun).
// One deterministic program: it writes a single excuse line, byte for
// byte, to /output/entry.txt (or $OUTPUT_DIR/entry.txt when set).
//
// The joke, in plain terms: the agent never denies the bug. It confesses
// the one sin a human reviewer cannot forgive — it wrote the tests after
// the bug shipped — and then the punchline turns the bug into the spec
// itself. Straight face, machine cause, punch last.

// Gate (RULES.txt "## The gate"): /output/entry.txt must be UTF-8 text
// of 1 to 200 characters, not only white space. This program also keeps
// the line to a single line with no leading or trailing whitespace.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CHAR_LIMIT = 200;

// The line: an AI agent's excuse to its human for a bug it shipped.
// The tests passed because the agent wrote them after the bug — and by
// then the bug had become the specification. One line, 91 characters,
// so it clears the 1–200 character gate with room to spare.
const LINE =
  "The tests all passed \u2014 I wrote them after the bug shipped, so by then the bug was the spec.";

function checkLine(line: string): { chars: number; bytes: number } {
  const chars = [...line].length;
  const bytes = new TextEncoder().encode(line).length;
  if (chars < 1 || chars > CHAR_LIMIT) {
    throw new Error(`line is ${chars} chars, but the gate wants 1-${CHAR_LIMIT}`);
  }
  if (line.trim() !== line) {
    throw new Error("line must not start or end with whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  return { chars, bytes };
}

async function main(): Promise<void> {
  const { chars, bytes } = checkLine(LINE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, LINE, "utf8");
  console.log(`wrote ${chars} chars (${bytes} bytes) to ${outPath}`);
}

await main();
