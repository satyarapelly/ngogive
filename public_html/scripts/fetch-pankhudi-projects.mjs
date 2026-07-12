#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DEFAULT_URL = 'https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&mission=1&categoryId=1&userId=132975&page=0&size=250';
const DEFAULT_STORAGE_DIR = 'public_html/storage/pankhudi/projects';

function parseArgs(argv) {
  const args = {
    url: process.env.PANKHUDI_PROJECTS_URL || DEFAULT_URL,
    storageDir: process.env.PANKHUDI_PROJECT_STORAGE || DEFAULT_STORAGE_DIR,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--url') args.url = argv[++index];
    else if (arg === '--storage-dir') args.storageDir = argv[++index];
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Fetch PANKHUDI project master data and keep only delta snapshots.\n\nUsage:\n  node public_html/scripts/fetch-pankhudi-projects.mjs [options]\n\nOptions:\n  --url <url>              Official projects API URL. Defaults to the Kumuram Bheem Asifabad 250-size URL.\n  --storage-dir <path>     Storage directory. Defaults to ${DEFAULT_STORAGE_DIR}.\n  --dry-run                Fetch and report the delta without updating local storage.\n  -h, --help               Show this help.\n\nEnvironment overrides:\n  PANKHUDI_PROJECTS_URL\n  PANKHUDI_PROJECT_STORAGE\n`);
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data?.content,
    payload?.data?.projects,
    payload?.data?.records,
    payload?.data,
    payload?.content,
    payload?.projects,
    payload?.records,
    payload?.result,
  ];
  const rows = candidates.find(Array.isArray);
  if (!rows) {
    throw new Error('Could not find a project array in the API response. Update extractRows() for this response shape.');
  }
  return rows;
}

function externalIdFor(row, index) {
  const value = row.projectUid ?? row.projectUID ?? row.projectId ?? row.projectID ?? row.id ?? row.uid;
  if (value === undefined || value === null || `${value}`.trim() === '') return `row-${index + 1}`;
  return `${value}`;
}

function compareRows(previousRows, nextRows) {
  const previousById = new Map(previousRows.map((row, index) => [externalIdFor(row, index), row]));
  const nextById = new Map(nextRows.map((row, index) => [externalIdFor(row, index), row]));
  const added = [];
  const updated = [];
  const unchanged = [];
  const removed = [];

  for (const [id, row] of nextById.entries()) {
    const previous = previousById.get(id);
    if (!previous) added.push(id);
    else if (sha256(stableStringify(previous)) !== sha256(stableStringify(row))) updated.push(id);
    else unchanged.push(id);
  }

  for (const id of previousById.keys()) {
    if (!nextById.has(id)) removed.push(id);
  }

  return { added, updated, unchanged, removed };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const storageDir = resolve(args.storageDir);
  const currentPath = join(storageDir, 'current.json');
  const manifestPath = join(storageDir, 'manifest.json');
  const deltaDir = join(storageDir, 'deltas');
  const fetchedAt = new Date().toISOString();

  const response = await fetch(args.url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`PANKHUDI API returned ${response.status} ${response.statusText}`);

  const payload = await response.json();
  const rows = extractRows(payload);
  const payloadHash = sha256(stableStringify(payload));
  const previousPayload = loadJson(currentPath, null);
  const previousRows = previousPayload ? extractRows(previousPayload) : [];
  const delta = compareRows(previousRows, rows);
  const report = {
    fetchedAt,
    sourceUrl: args.url,
    payloadHash,
    totalProjects: rows.length,
    previousProjects: previousRows.length,
    addedCount: delta.added.length,
    updatedCount: delta.updated.length,
    unchangedCount: delta.unchanged.length,
    removedCount: delta.removed.length,
    dryRun: args.dryRun,
    delta,
  };

  if (!args.dryRun) {
    writeJson(currentPath, payload);
    writeJson(join(deltaDir, `${fetchedAt.replace(/[:.]/g, '-')}.json`), report);
    const manifest = loadJson(manifestPath, { sourceUrl: args.url, runs: [] });
    manifest.sourceUrl = args.url;
    manifest.lastFetchedAt = fetchedAt;
    manifest.lastPayloadHash = payloadHash;
    manifest.lastTotalProjects = rows.length;
    manifest.runs.push({ fetchedAt, payloadHash, totalProjects: rows.length, added: delta.added.length, updated: delta.updated.length, removed: delta.removed.length });
    writeJson(manifestPath, manifest);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  const cause = error.cause?.message ? ` (${error.cause.message})` : '';
  console.error(`${error.message}${cause}`);
  process.exit(1);
});
