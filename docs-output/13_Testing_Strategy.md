# Testing Strategy · PromptPilot

**Version:** 1.0.0
**Status:** Approved
**Author:** QA Lead & Chief Software Architect
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0

---

## 1. Testing Philosophy

PromptPilot's testing strategy follows three principles:

1. **The prompts are the product.** Testing prompt output quality is as important as testing code.
2. **Deterministic where possible.** Structural validation and snapshot tests catch regressions without needing an LLM.
3. **LLM testing is expensive.** Reserve real LLM calls for nightly/weekly regression runs. Use mock adapters for CI.

**References:** Master Context §19 (AI Development Guidelines), §20 (Quality Standards), PRD §16 (Testing Strategy), NFR-M02 (Test Coverage)

---

## 2. Testing Pyramid

```
        ╱           ╲
       ╱    E2E      ╲       5-10 tests — full pipeline with mock LLM
      ╱───────────────╲
     ╱   Integration   ╲     50-80 tests — module interactions, file I/O
    ╱───────────────────╲
   ╱     Unit Tests       ╲   200+ tests — individual functions and classes
  ╱─────────────────────────╲
 ╱   Prompt Validation Tests  ╲  90+ tests — every prompt × 10 input variations
╱───────────────────────────────╲
```

### 2.1 Test Matrix

| Level                 | Framework                   | Scope                               | Count (Target) | CI Stage         | Run Frequency |
| --------------------- | --------------------------- | ----------------------------------- | -------------- | ---------------- | ------------- |
| **Unit**              | Vitest                      | Functions, classes, pure logic      | 200+           | Pre-commit       | Every push    |
| **Integration**       | Vitest + memfs              | Module interactions, file I/O       | 80+            | PR               | Every push    |
| **E2E**               | Vitest + execa              | Full CLI commands                   | 20+            | Merge to main    | Every push    |
| **Prompt Structural** | Vitest                      | Section presence, markdown validity | 90+            | PR               | Every push    |
| **Prompt Quality**    | Vitest + real LLM           | Cross-model quality regression      | 3-5 per model  | Weekly scheduled | Weekly        |
| **Performance**       | Vitest bench                | Benchmarks against NFR targets      | 10+            | PR               | Every push    |
| **Accessibility**     | Vitest + CLI output parsing | `--plain` output verification       | 15+            | PR               | Every push    |
| **Snapshot**          | Vitest                      | Prompt template immutability        | 9              | PR               | Every push    |

---

## 3. Unit Testing

### 3.1 What to Unit Test

| Module         | What to Test                                                | Examples                                                                              |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **shared**     | Error classes, token counter, logger redaction              | `countTokens('hello') -> 1`, `redactSensitive({apiKey:'x'}) -> {apiKey:'[REDACTED]'}` |
| **config**     | Config loading, resolution priority, schema validation      | `loadConfig()` returns defaults when no files exist, CLI overrides win                |
| **fs**         | Path normalization, atomic write, error handling            | `atomicWrite` renames temp file, handles permission errors                            |
| **adapters**   | Retry logic, adapter factory, provider detection            | `withRetry` retries 3 times, `createAdapter` throws for missing API keys              |
| **core**       | Pipeline state detection, context assembly, step resolution | `detectState` finds next step, `assembleContext` includes upstream artifacts          |
| **validators** | Section checking, markdown validation, quality scoring      | Missing section returns error, valid markdown returns 0 issues                        |
| **cli**        | Command registration, argument parsing, formatter output    | `--no-color` produces no ANSI codes, `--plain` produces `[SUCCESS]` tags              |

### 3.2 Unit Test Patterns

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { countTokens, estimateCost, formatCost, redactSensitive } from '@promptpilot/shared'

describe('countTokens', () => {
  it('counts simple text correctly', () => {
    expect(countTokens('hello world')).toBeGreaterThan(1)
  })

  it('returns 0 for empty string', () => {
    expect(countTokens('')).toBe(0)
  })

  it('handles very long text', () => {
    const longText = 'a '.repeat(10000)
    expect(countTokens(longText)).toBeGreaterThan(1000)
  })
})

describe('estimateCost', () => {
  it('calculates GPT-4o cost correctly', () => {
    const cost = estimateCost(1000, 500, 'gpt-4o')
    // $0.0025/1K input + $0.01/1K output
    expect(cost).toBeCloseTo(0.0075, 4)
  })

  it('returns 0 for unknown models (falls back to GPT-4o pricing)', () => {
    const cost = estimateCost(1000, 0, 'unknown-model')
    expect(cost).toBeGreaterThan(0)
  })
})

describe('formatCost', () => {
  it('shows "< $0.01" for very small costs', () => {
    expect(formatCost(0.005)).toBe('< $0.01')
  })

  it('shows dollar amount for larger costs', () => {
    expect(formatCost(0.05)).toBe('$0.05')
  })
})

describe('redactSensitive', () => {
  it('redacts apiKey field', () => {
    const input = { apiKey: 'sk-secret', name: 'test' }
    const result = redactSensitive(input)
    expect(result.apiKey).toBe('[REDACTED]')
    expect(result.name).toBe('test')
  })

  it('redacts nested keys', () => {
    const input = { providers: { openai: { apiKey: 'sk-secret' } } }
    const result = redactSensitive(input)
    expect((result.providers as any).openai.apiKey).toBe('[REDACTED]')
  })

  it('redacts authorization header', () => {
    const input = { headers: { authorization: 'Bearer token' } }
    const result = redactSensitive(input)
    expect((result.headers as any).authorization).toBe('[REDACTED]')
  })
})
```

### 3.3 Mocking Strategy

```typescript
// Use vi.mock for external dependencies
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  stat: vi.fn(),
  mkdir: vi.fn(),
  rename: vi.fn(),
}))

// Use memfs for file system tests
import { fs as memfs } from 'memfs'
vi.mock('fs/promises', () => memfs.promises)

// Mock fetch for adapter tests
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () =>
    Promise.resolve({
      choices: [{ message: { content: 'Generated content' } }],
      usage: { prompt_tokens: 100, completion_tokens: 200 },
    }),
})
```

---

## 4. Integration Testing

### 4.1 What to Integration Test

Integration tests verify module interactions with real (or realistic) file systems and mocked external APIs.

| Scenario                                   | Modules Involved           | What It Verifies                                              |
| ------------------------------------------ | -------------------------- | ------------------------------------------------------------- |
| `init` scaffolds a real directory          | cli + fs + config          | Files are created, content is correct, manifest is valid      |
| `run` with mock adapter generates artifact | cli + core + adapters + fs | Full pipeline step executes, output written, tokens counted   |
| `validate` on bad artifact reports errors  | cli + validators + fs      | Validation finds missing sections, markdown errors            |
| Config resolution from multiple sources    | config + fs                | Environment vars override file config, CLI flags override all |
| Context assembly from real files           | core + fs                  | Upstream artifacts are read and assembled correctly           |

### 4.2 Integration Test Example

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execa } from 'execa'
import { mkdtemp, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

describe('init command (integration)', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'promptpilot-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  it('scaffolds a project with all expected files', async () => {
    const result = await execa(
      'node',
      [
        'packages/cli/dist/cli.js',
        'init',
        'test-project',
        '--description',
        'A test project',
        '--audience',
        'developers',
        '--platform',
        'web',
        '--domain',
        'technology',
        '--yes',
      ],
      { cwd: tempDir },
    )

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('[SUCCESS]')

    // Verify files were created
    const { stat } = await import('fs/promises')
    const files = [
      'docs/00_Master_Context.md',
      'docs/01_PRD_Prompt.md',
      'docs-output/PRD.md',
      'promptpilot.json',
    ]
    for (const file of files) {
      const stats = await stat(join(tempDir, 'test-project', file))
      expect(stats.isFile()).toBe(true)
    }
  })

  it('fails gracefully when target directory exists', async () => {
    // Create the directory first
    await execa('mkdir', ['-p', 'test-project'], { cwd: tempDir })

    const result = await execa(
      'node',
      ['packages/cli/dist/cli.js', 'init', 'test-project', '--yes'],
      { cwd: tempDir, reject: false },
    )

    expect(result.exitCode).not.toBe(0)
    expect(result.stderr).toContain('already exists')
  })
})
```

---

## 5. End-to-End Testing

### 5.1 What to E2E Test

E2E tests verify full CLI commands with a mock LLM adapter. They test the entire stack end-to-end without calling real LLM APIs.

| Test                 | Command                                   | What It Verifies                                          |
| -------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Full pipeline (mock) | `run --all --yes`                         | All 9 steps execute, all files created, validation passes |
| Parallel execution   | `run --all --parallel --yes`              | Parallel steps execute concurrently, order is correct     |
| Validation pass      | `validate`                                | Clean artifacts produce 0 errors                          |
| Validation fail      | `validate` (with bad artifact)            | Bad artifact produces errors with specific messages       |
| Accessibility        | `run 1 --plain`                           | No unicode in output, `[SUCCESS]` tags present            |
| Streaming mode       | `run 1 --model mock`                      | Output appears incrementally                              |
| Config commands      | `config set`, `config get`, `config list` | Config reads and writes correctly                         |

### 5.2 Mock Adapter for E2E

```typescript
// test/mocks/e2e-adapter.ts
export function setupMockAdapter() {
  process.env.PROMPTPILOT_MOCK_MODE = 'true'

  // Mock all fetch calls with canned responses
  global.fetch = vi.fn().mockImplementation((url: string, options: any) => {
    const body = JSON.parse(options?.body || '{}')
    const promptContent = body.messages?.[0]?.content || body.prompt || ''
    const response = getCannedResponse(promptContent)

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
      body: createMockStream(response.content),
    })
  })
}

function getCannedResponse(prompt: string) {
  // Detect which prompt is being tested by looking for key phrases
  if (prompt.includes('Product Requirements Document')) {
    return cannedPRDResponse
  }
  if (prompt.includes('Software Requirements Specification')) {
    return cannedSRSResponse
  }
  // ... etc for all 9 prompt types
  return cannedDefaultResponse
}
```

---

## 6. Prompt Validation Testing

### 6.1 Structural Tests (Run Every Push)

Every prompt template is tested against 10+ input variations. The mock adapter returns pre-written, realistic outputs. Tests verify:

- All required sections are present.
- No placeholder text (TBD, TODO, Lorem ipsum).
- Heading hierarchy is valid.
- Markdown syntax is correct.
- Tables are well-formed.
- Cross-references use correct format.

**Test count:** 9 prompts × 10 inputs = 90 structural tests.

### 6.2 Quality Tests (Run Weekly)

With real LLM APIs, generate output for 3-5 representative inputs per prompt, across 2-3 LLM providers.

**Test count:** 9 prompts × 3 inputs × 2 models = 54 quality tests.

```typescript
describe('Prompt Quality Regression (Weekly)', () => {
  // These tests require API keys — skipped in normal CI
  const RUN_QUALITY_TESTS = !!process.env.OPENAI_API_KEY

  it.skipIf(!RUN_QUALITY_TESTS)(
    'GPT-4o: PRD passes quality review',
    async () => {
      const adapter = new OpenAIAdapter('gpt-4o', {
        apiKey: process.env.OPENAI_API_KEY!,
      })

      const template = await loadTemplate('docs/01_PRD_Prompt.md', taskflowFixture)
      const result = await adapter.generate(template.content, {
        temperature: 0.2,
        maxTokens: 16000,
        stream: false,
      })

      const score = scoreArtifact(result.content, template)
      expect(score).toBeGreaterThanOrEqual(75) // Quality threshold
      expect(result.content).not.toMatch(/\b(TODO|TBD|Lorem ipsum)\b/i)
    },
    120_000, // 2-minute timeout for LLM call
  )
})
```

---

## 7. Performance Testing

### 7.1 Benchmarks

```typescript
import { bench, describe } from 'vitest'

describe('Performance Benchmarks', () => {
  bench(
    'CLI startup (cold)',
    async () => {
      const { execa } = await import('execa')
      await execa('node', ['packages/cli/dist/cli.js', '--version'])
    },
    { time: 1000 },
  )

  bench('Context assembly', async () => {
    const manifest = await loadManifest('test/fixtures/promptpilot.json')
    const state = await detectState(manifest, 'test/fixtures/docs-output')
    const step = state.steps.get('srs')!
    await assembleContext(step, state.artifacts)
  })
})
```

### 7.2 Performance Targets

All CI pipelines assert these targets:

| Metric                 | Target  | NFR ID  | Assertion                            |
| ---------------------- | ------- | ------- | ------------------------------------ |
| CLI startup (cold)     | < 500ms | NFR-P01 | `assert(median < 500)`               |
| Context assembly       | < 2s    | NFR-P07 | `assert(median < 2000)`              |
| Memory (full pipeline) | < 100MB | NFR-P04 | `assert(maxRSS < 100 * 1024 * 1024)` |
| Disk footprint         | < 20MB  | NFR-P05 | `assert(size < 20 * 1024 * 1024)`    |

---

## 8. Accessibility Testing

```typescript
describe('CLI Accessibility', () => {
  const commands = ['init', 'run', 'validate', 'config', 'help']

  for (const cmd of commands) {
    it(`${cmd} --plain produces no unicode`, async () => {
      const result = await execa('node', ['packages/cli/dist/cli.js', cmd, '--plain', '--help'])

      // No unicode spinners, emoji, or box-drawing characters
      expect(result.stdout).not.toMatch(/[\u2500-\u257F]/) // Box drawing
      expect(result.stdout).not.toMatch(/[\u2580-\u259F]/) // Block elements
      expect(result.stdout).not.toMatch(/[\u1F300-\u1F9FF]/) // Emoji, misc symbols
      expect(result.stdout).not.toMatch(/[✓✗●○◉◎◉✔]/) // Unicode symbols

      // Prefixed text labels
      expect(result.stdout).not.toContain('[object Object]')
    })

    it(`${cmd} --no-color produces no ANSI codes`, async () => {
      const result = await execa('node', ['packages/cli/dist/cli.js', cmd, '--no-color', '--help'])
      expect(result.stdout).not.toMatch(/\x1b\[/) // ANSI escape codes
    })
  }
})
```

---

## 9. Snapshot Testing

Every prompt template has a snapshot test:

```typescript
import { describe, it, expect } from 'vitest'
import { readFile } from 'fs/promises'

const promptFiles = [
  'docs/00_Master_Context.md',
  'docs/01_PRD_Prompt.md',
  'docs/02_SRS_Prompt.md',
  'docs/03_System_Architecture_Prompt.md',
  'docs/04_Database_Schema_Prompt.md',
  'docs/05_API_Specification_Prompt.md',
  'docs/06_User_Flow_Prompt.md',
  'docs/07_UI_Wireframes_Prompt.md',
  'docs/08_Feature_Roadmap_Prompt.md',
  'docs/09_Implementation_Plan_Prompt.md',
]

describe('Prompt Template Snapshots', () => {
  for (const file of promptFiles) {
    it(`${file} has not changed unexpectedly`, async () => {
      const content = await readFile(file, 'utf-8')
      expect(content).toMatchSnapshot()
    })
  }
})
```

Snapshots are committed. Any prompt change must be reviewed and approved.

---

## 10. Test Fixtures

### 10.1 Fixture Sets

```
test/fixtures/
├── taskflow/                    # SaaS task management app
│   ├── input.json
│   └── expected/
│       ├── 00_Master_Context.md
│       ├── 01_PRD.md
│       └── ...
├── healthapp/                   # Healthcare platform
├── gameengine/                  # Game engine SDK
├── fintech-api/                 # Fintech API service
└── minimal/                     # Minimal inputs (edge case)
```

### 10.2 Fixture Format

```json
{
  "PRODUCT_NAME": "TaskFlow",
  "ONE_LINE_DESCRIPTION": "AI-powered task management for remote teams",
  "TARGET_AUDIENCE": "Product Managers",
  "PLATFORM": "Web Application",
  "INDUSTRY_DOMAIN": "Productivity / SaaS"
}
```

---

## 11. CI Test Pipeline

### 11.1 Fast CI (Every Push)

Runs in < 5 minutes:

1. Lint + Format check
2. Type check
3. Unit tests
4. Snapshot tests
5. Prompt structural tests (mock adapter)
6. Accessibility tests

### 11.2 Full CI (Every PR)

Runs in < 10 minutes:

1. Everything from Fast CI
2. Integration tests
3. E2E tests (mock adapter)
4. Performance benchmarks
5. `npm audit`

### 11.3 Nightly CI (Daily)

Runs in < 30 minutes:

1. Everything from Full CI
2. Prompt quality tests (real LLM APIs)
3. Cross-model regression tests
4. Full pipeline on all 7 fixture sets

### 11.4 Weekly CI (Weekly)

1. Everything from Nightly CI
2. Dependency vulnerability scan
3. Code coverage report generation
4. Bundle size trend analysis

---

## 12. Test Coverage Requirements

| Package      | Line Coverage | Branch Coverage | Function Coverage |
| ------------ | ------------- | --------------- | ----------------- |
| `shared`     | 100%          | 100%            | 100%              |
| `config`     | 95%           | 90%             | 100%              |
| `fs`         | 90%           | 85%             | 100%              |
| `adapters`   | 90%           | 85%             | 100%              |
| `core`       | 85%           | 80%             | 95%               |
| `validators` | 95%           | 90%             | 100%              |
| `cli`        | 80%           | 75%             | 90%               |

Overall: **≥ 85% lines, ≥ 80% branches** per NFR-M02.

---

## 13. Bug Regression Policy

When a bug is found:

1. Write a test that reproduces the bug.
2. Verify the test fails.
3. Fix the bug.
4. Verify the test passes.
5. Tag the test with the issue number: `it('fixes #123: empty input causes crash', ...)`.

---

**End of Testing Strategy**
