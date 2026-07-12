# PANKHUDI project download and delta tracking

This repository includes a command-line project downloader for the Kumuram Bheem Asifabad PANKHUDI project master feed.

## Default source

The default URL is the provided one-district API request:

```text
https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&mission=1&categoryId=1&userId=132975&page=0&size=250
```

The `size=250` parameter matches the current expected district project batch size. Treat that value as a request size, not a permanent limit.

## Run

Preview without writing local storage:

```bash
node public_html/scripts/fetch-pankhudi-projects.mjs --dry-run
```

Download and update local storage:

```bash
node public_html/scripts/fetch-pankhudi-projects.mjs
```

Use a different URL or storage folder:

```bash
node public_html/scripts/fetch-pankhudi-projects.mjs \
  --url "https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?..." \
  --storage-dir public_html/storage/pankhudi/projects
```

## Storage and delta behavior

The command writes under `public_html/storage/pankhudi/projects/` by default:

- `current.json` stores the latest full API response.
- `manifest.json` stores the source URL, latest hash, latest count, and import run history.
- `deltas/<timestamp>.json` stores the internal delta report for each run.

Each run compares rows by immutable-looking external identifiers (`projectUid`, `projectUID`, `projectId`, `projectID`, `id`, or `uid`) and hashes each normalized row. The report separates `added`, `updated`, `unchanged`, and `removed` project IDs so only changed project records need downstream processing.

The storage directory is git-ignored because live project payloads may include operational or beneficiary data. Commit code and documentation, not downloaded government data.

## Integration boundary

This command only calls the supplied JSON API endpoint and stores an internal mirror for reconciliation. It does not scrape the PANKHUDI portal, automate login, or submit updates back to the government system.
