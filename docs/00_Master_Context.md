# 00 — Master Context · PromptPilot

**Version:** 1.0.0
**Status:** Authoritative — Single Source of Truth
**Last Updated:** 2026-07-19

---

## 1. Product Vision

PromptPilot becomes the industry-standard launchpad for software projects — the first tool every team reaches for when turning an idea into a buildable, shippable product. We envision a world where no software project starts blind. Every idea, whether from a solo founder or an enterprise team, begins with a complete, consistent, AI-generated specification suite that eliminates ambiguity before a single line of code is written.

---

## 2. Mission

Accelerate the journey from idea to implementation by providing a rigorous, repeatable, AI-powered planning pipeline that produces production-ready software artifacts in hours instead of weeks.

---

## 3. Core Problem

Software projects fail most often in the planning phase — not during implementation. Teams waste weeks writing PRDs, SRS documents, architecture designs, API specs, and wireframes that are inconsistent, incomplete, and contradictory. Existing AI tools generate these artifacts in isolation with no cross-document traceability. The result: rework, scope creep, misaligned teams, and projects that ship late or never ship at all.

---

## 4. Value Proposition

**One curated prompt pipeline. One source of truth. Every artifact you need to start building.**

PromptPilot provides a sequenced set of expertly engineered AI prompts. Each prompt references the outputs of prior prompts, ensuring every artifact — from PRD to database schema to feature roadmap — is internally consistent, fully traceable, and implementation-ready.

---

## 5. Target Users

### Primary Personas

| Persona                 | Role                                         | Pain Point                                                | Proficiency                        |
| ----------------------- | -------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| **Solo Founder**        | Indie hacker building an MVP                 | Overwhelmed by planning; skips it and builds blindly      | Technical, but not a planner       |
| **Product Manager**     | PM at a startup or scale-up                  | Spends weeks coordinating specs across teams              | High planning skill, time-poor     |
| **Tech Lead**           | Senior engineer leading a greenfield project | Needs architecture and API specs fast to unblock the team | High technical, medium planning    |
| **Engineering Manager** | EM overseeing multiple squads                | Needs consistent standards across teams and projects      | High management, variable planning |
| **Consultant / Agency** | Building software for clients                | Needs to produce professional deliverables quickly        | High technical and planning        |

### Secondary Personas

| Persona             | Role                       | Pain Point                                         |
| ------------------- | -------------------------- | -------------------------------------------------- |
| **QA Lead**         | Test lead on a new project | No clear spec to write test cases from             |
| **Designer**        | UX/UI designer             | No structured requirements to design against       |
| **DevOps Engineer** | Infra engineer             | No architecture or scaling requirements documented |

---

## 6. Business Goals

| Goal          | Metric                             | Target (Year 1)                          |
| ------------- | ---------------------------------- | ---------------------------------------- |
| **Adoption**  | GitHub stars / weekly downloads    | 5,000 stars / 1,000 weekly npm downloads |
| **Usage**     | Projects created using PromptPilot | 10,000 active projects                   |
| **Community** | Contributors to prompt templates   | 100+ contributors                        |
| **Ecosystem** | Third-party prompt packs published | 50+ community prompt packs               |
| **Revenue**   | Enterprise / hosted tier adoption  | 50 paying teams                          |

---

## 7. Product Principles

1. **Prompt-First, Not Code-First.** The product is a prompt pipeline. Every feature serves the quality and consistency of generated artifacts.
2. **Traceability Over Volume.** It's better to have 9 perfectly linked artifacts than 50 disconnected ones. Every requirement traces back to the Master Context.
3. **LLM-Agnostic by Default.** Prompts are designed to work with any capable LLM. No vendor lock-in.
4. **Progressive Depth.** Start with just a product name and one-liner. Each step builds on the last. Users invest incrementally.
5. **Human in the Loop.** AI generates. Humans review, refine, and approve. The tool accelerates, it does not replace judgment.
6. **Open Core.** The prompt pipeline is open source. Value-add features (teams, versioning, CI integration) can be commercial.
7. **Documentation as Product.** The prompts themselves are the product. They must be clear, well-structured, and self-documenting.
8. **Convention Over Configuration.** Sensible defaults everywhere. Users can override but they shouldn't have to.

---

## 8. Design Philosophy

- **Content is the Interface.** PromptPilot is text-in, text-out. The "design" is the structure and clarity of the prompts and the quality of the artifacts they produce.
- **Minimal Friction.** The user should go from idea to first artifact in under 5 minutes. No sign-up required for core use.
- **CLI-First, GUI-Second.** The primary interface is a command-line tool that orchestrates prompt execution. A web UI may follow.
- **Transparent Process.** Users see exactly which prompts run, in what order, and why. No black-box generation.

---

## 9. UX Principles

1. **Progressive Disclosure.** Show the next step only when the user is ready. Don't overwhelm with the full pipeline upfront.
2. **Consistent Mental Model.** Every prompt follows the same structure: context → instructions → output format. Users learn the pattern once.
3. **Immediate Value.** The first artifact (PRD) must be impressive enough to justify continuing the pipeline.
4. **Graceful Recovery.** If a generated artifact is wrong, the user can edit it and re-run downstream prompts — the pipeline is idempotent.
5. **Clear Feedback.** Every prompt execution shows: what ran, what was generated, where it was saved, and what to do next.
6. **No Dead Ends.** Every screen and every prompt ends with a clear next action.

---

## 10. UI Standards

- **CLI Output:** Use color-coded sections (green for success, yellow for warnings, red for errors). Progress spinners for long-running generations. Clear file paths for saved artifacts.
- **Markdown Rendering:** All generated artifacts are valid CommonMark. Tables, code blocks, and lists render correctly in any markdown viewer.
- **File Organization:** All artifacts follow the `docs-output/` convention. Generated files are clearly separated from prompt templates.
- **Naming:** Files use `NN_Category_Name.md` format for prompts and `Category.md` for outputs. No spaces, no special characters beyond underscores and hyphens.

---

## 11. Engineering Principles

1. **Simplicity First.** The core is a markdown file orchestrator. Don't build a framework until the need is proven.
2. **Composability.** Prompts are standalone but chainable. Users can skip steps or insert custom prompts.
3. **Deterministic Scaffolding.** File paths, naming, and structure are deterministic. CI/CD pipelines can depend on them.
4. **Platform Agnosticism.** Runs on macOS, Linux, and Windows. Node.js is the only runtime dependency (for the CLI).
5. **Zero Configuration Start.** `npx promptpilot init` creates the entire scaffold. No config files required.
6. **Test the Prompts.** Prompt quality is tested by running them against known inputs and asserting output structure and content.
7. **Version Everything.** Prompt templates, generated artifacts, and the CLI itself are all versioned.

---

## 12. Coding Standards

- **Language:** TypeScript for the CLI. Markdown for prompts.
- **Formatting:** Prettier with default config. No semicolons. Single quotes. Trailing commas.
- **Linting:** ESLint with recommended TypeScript rules and Prettier integration.
- **Imports:** ES module syntax. No relative imports beyond one level up (`../`). Use path aliases for deep imports.
- **Functions:** Pure functions preferred. Side effects isolated to command handlers. Max 30 lines per function.
- **Error Handling:** Never swallow errors. Use typed errors. Provide actionable error messages.
- **Comments:** Only for non-obvious logic. Prompts are self-documenting. Code should be too.

---

## 13. Naming Conventions

| Element                   | Convention                | Example                               |
| ------------------------- | ------------------------- | ------------------------------------- |
| **Files (prompts)**       | `NN_Category_Prompt.md`   | `01_PRD_Prompt.md`                    |
| **Files (outputs)**       | `Category.md`             | `PRD.md`                              |
| **Directories**           | kebab-case                | `docs-output/`, `prompt-packs/`       |
| **TypeScript interfaces** | PascalCase, no `I` prefix | `PromptConfig`, `ArtifactResult`      |
| **TypeScript functions**  | camelCase, verb-first     | `runPrompt()`, `validateOutput()`     |
| **TypeScript constants**  | UPPER_SNAKE_CASE          | `DEFAULT_MODEL`, `MAX_TOKENS`         |
| **TypeScript enums**      | PascalCase, singular      | `ArtifactType`, `PromptStatus`        |
| **CLI commands**          | kebab-case                | `promptpilot run`, `promptpilot init` |
| **CLI flags**             | kebab-case                | `--output-dir`, `--skip-srs`          |

---

## 14. Architecture Principles

1. **Stateless CLI.** The CLI reads prompt files, sends them to an LLM, writes output. No server, no database, no persistent state (in open-source mode).
2. **Pluggable LLM Backend.** Abstract the LLM call behind an interface. Support OpenAI, Anthropic, Google, and local models via Ollama.
3. **File-Based Pipeline.** Pipeline state is maintained in the filesystem. The presence or absence of artifacts determines what can run next.
4. **Immutable Prompts, Mutable Outputs.** Prompt templates in `docs/` are read-only reference. Outputs in `docs-output/` are user-editable.
5. **Separation of Concerns.** Prompt execution, file I/O, and CLI argument parsing are separate modules.
6. **No Runtime Dependencies on Generated Content.** The CLI validates artifact structure but never depends on artifact content to function.

---

## 15. Security Principles

1. **No Data Exfiltration.** The CLI sends only the prompt content and user-provided context to the LLM. No telemetry, no analytics, no phoning home.
2. **API Key Hygiene.** LLM API keys are read from environment variables or a local `.env` file (gitignored). Never stored in config files or transmitted elsewhere.
3. **Local-First.** All files stay on the user's machine. No cloud storage, no sync, no uploads.
4. **Prompt Injection Awareness.** Prompt templates use placeholder syntax (`{VARIABLE}`) that is resolved before LLM submission. User-provided values are sanitized to prevent injection.
5. **Minimal Dependencies.** Every npm dependency is audited. The dependency tree is shallow by design.
6. **Content Isolation.** Generated artifacts are markdown files. No executable code, no script injection vectors in the output pipeline.

---

## 16. Performance Standards

| Metric                                      | Target                                                                                                     |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **CLI startup time**                        | < 500ms cold, < 200ms warm                                                                                 |
| **Single prompt execution (API roundtrip)** | < 30s for a full artifact generation                                                                       |
| **Full pipeline execution (9 prompts)**     | < 5 minutes end-to-end                                                                                     |
| **Memory usage**                            | < 100MB resident                                                                                           |
| **Disk footprint**                          | < 20MB installed (excluding node_modules)                                                                  |
| **Concurrent prompt execution**             | Support parallel generation of independent artifacts (UserFlow + Wireframes can run in parallel after PRD) |

---

## 17. Accessibility Standards

- **CLI Accessibility:** All output must be readable by screen readers. Use plain text progress indicators, not unicode-heavy spinners. Provide `--no-color` and `--plain` flags.
- **Generated Artifact Accessibility:** Generated markdown follows accessible heading hierarchy (never skip levels). Tables include headers. Images described with alt text. Color is never the sole differentiator.
- **Documentation Accessibility:** All docs and README files are screen-reader friendly. Links have descriptive text.

---

## 18. Documentation Standards

- **Self-Contained Files.** Every document can be read and understood in isolation. Cross-references use explicit file paths.
- **Progressive Detail.** Documents start with a one-paragraph summary, then expand. Header hierarchy reflects the information architecture.
- **Examples Over Abstractions.** Every concept is illustrated with a concrete example. Sample inputs and outputs are shown.
- **Living Documents.** Documentation is versioned alongside the code. PRs that change prompts must update the corresponding documentation.
- **README-Driven Development.** The README is the first artifact written and the last artifact updated. It must be accurate at all times.

---

## 19. AI Development Guidelines

1. **Prompt Templates Are Code.** Prompts are version-controlled, reviewed, and tested like any other source file. A prompt change is a code change.
2. **Deterministic Where Possible.** Use structured output formats, explicit section headers, and clear boundary markers so generated artifacts can be parsed programmatically.
3. **Temperature Discipline.** Use low temperature (0.0–0.3) for specification generation to maximize consistency. Allow higher temperature only for creative artifacts (naming, marketing copy).
4. **Context Window Management.** Each prompt includes only the artifacts it directly depends on. Don't stuff the entire pipeline into every prompt — it degrades output quality.
5. **Output Validation.** After every generation, validate: file was created, required sections exist, cross-references are intact. Warn the user if validation fails.
6. **Model-Specific Tuning.** Acknowledge that different LLMs have different strengths. Provide model-specific guidance in the CLI (e.g., "This prompt works best with Claude 3.5 Sonnet or GPT-4o").
7. **No AI Slop.** Generated artifacts should read like they were written by a senior engineer, not an over-eager intern. No buzzwords without substance. No filler paragraphs.

---

## 20. Quality Standards

| Dimension                      | Standard                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Artifact Completeness**      | Every required section in every prompt is populated. No "TBD" or "TODO" in generated output.                              |
| **Cross-Document Consistency** | A feature mentioned in the PRD appears in the SRS, API spec, and roadmap with the same description and priority.          |
| **Traceability**               | Every requirement can be traced from the Master Context → PRD → SRS → Architecture → API/DB → Roadmap.                    |
| **Readability**                | Generated artifacts pass a "new team member" test: a developer reading them for the first time understands what to build. |
| **Grammar & Tone**             | Professional, consistent voice across all artifacts. No markdown syntax errors.                                           |
| **Test Coverage**              | Prompt validation tests exist for every prompt template. Integration tests exist for the full pipeline.                   |

---

## 21. Project Constraints

| Constraint          | Detail                                                                         |
| ------------------- | ------------------------------------------------------------------------------ |
| **Runtime**         | Node.js ≥ 20.x (active LTS)                                                    |
| **Package Manager** | npm (no requirement for pnpm/yarn, but compatible)                             |
| **LLM Dependency**  | Requires access to at least one LLM API (OpenAI, Anthropic, Google, or Ollama) |
| **Filesystem**      | Requires read/write access to the project directory                            |
| **Internet**        | Required for LLM API calls (unless using local Ollama)                         |
| **Language**        | TypeScript (CLI), Markdown (prompts & outputs)                                 |
| **License**         | MIT (open source)                                                              |
| **Team Size**       | Designed for teams of 1-50. No enterprise-specific features in v1.             |

---

## 22. Assumptions

1.  The user has access to an LLM API key or a local LLM installation.
2.  The user has Node.js ≥ 20.x installed.
3.  The user is comfortable with a CLI interface.
4.  The LLM produces output that follows the structural instructions in the prompts (tested against Claude 3.5 Sonnet and GPT-4o).
5.  The generated artifacts will be reviewed by a human before implementation begins.
6.  Users understand the purpose of each artifact (PRD vs SRS vs Architecture).
7.  The project directory is a git repository (not required but recommended).
8.  Markdown is an acceptable output format for all artifacts (no Word, PDF, or Confluence export in v1).

---

## 23. Risks

| Risk                                   | Likelihood | Impact | Mitigation                                                                           |
| -------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------ |
| **LLM quality degradation**            | Medium     | High   | Pin model versions in prompts. Test against multiple providers.                      |
| **Prompt injection attacks**           | Low        | High   | Sanitize user input. Template-based variable injection.                              |
| **Scope creep on prompt templates**    | High       | Medium | Strict review process for prompt changes. Keep prompts focused.                      |
| **LLM API cost barrier**               | Medium     | Medium | Support local Ollama. Provide cost estimates per prompt run.                         |
| **Output inconsistency across models** | High       | Medium | Model-specific tuning notes. Validation layer that checks output structure.          |
| **Fragmented ecosystem**               | Medium     | Low    | Open-source prompt packs. Community contribution guidelines.                         |
| **PromptPilot is too niche**           | Low        | High   | Broaden to general-purpose "AI prompt pipelines" if planning use case is too narrow. |

---

## 24. Success Metrics

| Metric                       | Measurement                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **Time-to-Spec**             | Average time from `promptpilot init` to complete artifact suite: target < 30 minutes of human time |
| **Pipeline Completion Rate** | % of users who run the full 9-prompt pipeline after starting: target > 60%                         |
| **Artifact Quality Score**   | User rating on generated artifacts: target ≥ 4.2/5                                                 |
| **Rework Reduction**         | Self-reported reduction in planning rework vs. manual process: target > 50%                        |
| **Adoption Velocity**        | Time from discovery to first `promptpilot run`: target < 10 minutes                                |
| **Community Growth**         | GitHub stars growth rate: target > 100/month within 6 months                                       |

---

## 25. Future Scalability Goals

### Short-Term (0-6 months)

- Custom prompt packs: users can define and share their own prompt sequences.
- Multiple output formats: JSON, YAML, and OpenAPI spec files alongside markdown.
- Interactive mode: prompt the user for missing context during generation.

### Medium-Term (6-12 months)

- Team collaboration: share prompt packs and generated artifacts via a hosted registry.
- CI/CD integration: run the prompt pipeline as part of a GitHub Actions workflow.
- Diff and versioning: track changes to generated artifacts between pipeline runs.

### Long-Term (12+ months)

- Web UI: visual pipeline editor and artifact viewer.
- Multi-language output: generate artifacts in languages other than English.
- Agentic planning: the pipeline itself becomes an AI agent that asks clarifying questions and iteratively refines artifacts.
- IDE integration: VS Code / JetBrains extensions for inline artifact editing with LLM assistance.
