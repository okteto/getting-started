# AGENTS.md

Instructions for coding agents (Claude Code and others) working in this repository.

## Project overview

The Movies app: a React frontend (`frontend/`), a Node.js/Express API (`api/`), and a MongoDB
database, deployed to Kubernetes with Helm: the chart in `chart/` for the app, and the Bitnami chart
for MongoDB. End-to-end tests live in `e2e/`
(Playwright). Everything is driven by the Okteto Manifest in `okteto.yaml`:

- `build`: the images of `frontend` and `api`
- `deploy`: two Helm commands. The first one installs MongoDB with the Bitnami chart, and the second
  one installs the chart in `chart/` with the built images: the `frontend` and `api` services, and a
  `seed` job that loads the data
- `test`: `e2e` (Playwright against the deployed app). The unit tests of `frontend` (Vitest) and
  `api` (Jest) aren't in the Okteto Manifest: run them with `npm test` in their folders

Do not run the app or tests with local `npm`/`docker` as a substitute for the workflow below.
Use the Okteto Manifest so that what you validate is what CI and Preview Environments run.

## Required workflow for every change

After making code changes, always go through these steps in order. Do not skip a step, and do not
move to the next one if the current one fails: fix the problem and start again from step 1.

### 0. Check the Okteto context

```bash
okteto context show
okteto namespace
```

If there is no context or you are not logged in, stop and ask the user to run
`! okteto context use <okteto-url>`. Do not guess the Okteto URL.

### 1. Build

```bash
okteto build
```

This builds every image in the `build` section of `okteto.yaml`. To rebuild a single service,
use `okteto build api` or `okteto build frontend`.

### 2. Deploy

```bash
okteto deploy --wait
```

This deploys MongoDB and the Helm chart of the app in the current Okteto namespace. Once it
finishes, get the public endpoints with:

```bash
okteto endpoints
```

If the deployment fails, inspect it with `kubectl get pods` and `kubectl logs <pod>` (the Okteto
CLI configures `kubectl` for the current namespace) before changing anything.

### 3. Test

```bash
okteto test
```

This runs the `e2e` tests of the `test` section against the deployed environment. Playwright reports are written to
`e2e/playwright-report/` and `e2e/test-results/`.

All tests must pass before the change is considered done. If a test fails, read the output and the
Playwright report, fix the root cause, and go back to step 1. Never disable, skip, or weaken a test
to make it pass unless the user explicitly asks for it.

### 4. Report the results

Tell the user the results of `okteto build`, `okteto deploy`, and `okteto test` (pass/fail per test
suite), and the endpoints from `okteto endpoints` used for testing.

## Committing

Only commit when the user asks. Stage the files you changed by name; never use `git add -A` or
`git add .`. The working tree can contain untracked local files (for example Kubernetes dumps with
tokens) that must not be committed. Review `git status` and `git diff --staged` before committing.

## Cleanup

Leave the deployment in your namespace running so the user can inspect it, unless they ask you to
remove it. To remove it, run `okteto destroy`.
