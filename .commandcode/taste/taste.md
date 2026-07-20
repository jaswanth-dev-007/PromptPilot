# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# project-structure

- Prompt template files belong in the `docs/` directory, and generated output artifacts belong in `docs-output/`. Confidence: 0.65

# workflow

- Before applying any edits, run a complete validation (TypeScript build, imports, circular deps, duplicate packages, workspace refs, package.json/tsconfig.json validity, npm install, build, test, lint, typecheck). Fix any issues, re-run validation, and repeat until all pass before presenting edits for approval. Confidence: 0.85
