#!/usr/bin/env node
"use strict";

/*
 * Gate for `npm audit --json` output.
 *
 * Usage:
 *   npm audit --omit=dev --json > report.json || true
 *   node ci/npm-audit-gate.js <level> < report.json
 *
 * <level> is the minimum severity that can fail the build:
 *   low | moderate | high | critical   (default: high)
 *
 * The build fails when the report contains an advisory at or above <level>
 * that is not listed in ci/audit-allowlist.json, or whose allowlist entry has
 * expired. It also fails when the report cannot be read (for example when the
 * npm registry is unreachable), so the check is never skipped silently.
 */

const fs = require("fs");
const allowlist = require("./audit-allowlist.json");

const LEVELS = ["info", "low", "moderate", "high", "critical"];
const GHSA_PATTERN = /GHSA(-[a-z0-9]{4}){3}/i;

function fail(message) {
  console.error(`npm audit gate: ${message}`);
  process.exit(1);
}

const level = (process.argv[2] || "high").toLowerCase();
const threshold = LEVELS.indexOf(level);

if (threshold === -1) {
  console.error(`npm audit gate: unknown level "${level}" (use ${LEVELS.join(", ")})`);
  process.exit(2);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(0, "utf8"));
} catch (err) {
  fail("could not parse the npm audit output. Is the npm registry reachable?");
}

if (!report || report.error || typeof report.vulnerabilities !== "object") {
  const detail = report && report.error ? ` (${report.error.summary || report.error.code})` : "";
  fail(`npm audit did not return a usable report${detail}.`);
}

// Collect advisories. In the npm v7+ format, an advisory is an object inside
// a vulnerability's "via" list; string entries only point to another package.
const advisories = new Map();

for (const [pkg, vuln] of Object.entries(report.vulnerabilities)) {
  for (const via of vuln.via || []) {
    if (typeof via !== "object" || via === null) continue;

    const match = GHSA_PATTERN.exec(via.url || "");
    const id = (match ? match[0] : String(via.source)).toLowerCase();

    if (!advisories.has(id)) {
      advisories.set(id, {
        id,
        severity: via.severity,
        title: via.title,
        packages: new Set(),
      });
    }

    advisories.get(id).packages.add(via.name || pkg);
  }
}

const now = new Date();
const accepted = new Map(
  (allowlist.accepted || []).map((entry) => [String(entry.id).toLowerCase(), entry]),
);

function acceptance(id) {
  const entry = accepted.get(id);
  if (!entry) return { ok: false, note: "not in allowlist" };

  const expires = new Date(`${entry.expires}T23:59:59Z`);
  if (Number.isNaN(expires.getTime())) {
    return { ok: false, note: "allowlist entry has no valid expiry date" };
  }
  if (expires < now) {
    return { ok: false, note: `allowlist entry expired on ${entry.expires}` };
  }
  return { ok: true, note: `accepted until ${entry.expires}: ${entry.reason}` };
}

const relevant = [...advisories.values()]
  .filter((advisory) => LEVELS.indexOf(advisory.severity) >= threshold)
  .sort((a, b) => LEVELS.indexOf(b.severity) - LEVELS.indexOf(a.severity));

console.log(`npm audit gate (fail on ${level} and above)`);

let blocked = 0;

for (const advisory of relevant) {
  const { ok, note } = acceptance(advisory.id);
  const status = ok ? "ACCEPTED" : "BLOCKED ";
  if (!ok) blocked += 1;

  console.log(
    `  ${status} ${advisory.severity.padEnd(9)} ${[...advisory.packages].join(", ")}  ` +
      `${advisory.id.toUpperCase()}  ${advisory.title}`,
  );
  console.log(`           ${note}`);
}

if (relevant.length === 0) {
  console.log(`  No advisories at ${level} or above.`);
}

if (blocked > 0) {
  fail(`${blocked} advisory(ies) must be fixed or explicitly accepted in ci/audit-allowlist.json.`);
}

console.log("npm audit gate: passed.");