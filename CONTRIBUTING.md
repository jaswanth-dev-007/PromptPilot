# Contributing to PromptPilot

Thanks for your interest in contributing!

## Getting Started

1. Read `docs/00_Master_Context.md` to understand the product vision.
2. Read `docs-output/09_Implementation_Plan.md` for the architecture.
3. Read `docs-output/15_Project_Playbook.md` for development workflows.
4. Set up your environment (see Playbook §3).

## Development

```bash
npm install
npm run build
npm test
```

## Pull Requests

1. Create a branch: `feature/<description>` or `fix/<description>`.
2. Write tests for your changes.
3. Run `npm run ci` before pushing.
4. Open a PR referencing the issue or FR ID.

## Prompt Template Changes

Prompt template changes require 2 approvals and snapshot test updates.
See `docs-output/12_AI_Development_Guide.md` §3.4 for the full process.

## Code of Conduct

Be kind. Assume good intent. Help others learn.
