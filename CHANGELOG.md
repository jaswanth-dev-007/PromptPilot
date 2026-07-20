# Changelog

All notable changes to PromptPilot will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project skeleton: monorepo with 7 packages (shared, config, fs, adapters, validators, core, cli)
- TypeScript strict mode, ESLint, Prettier, Vitest configuration
- CI/CD pipelines (lint, test, build, release)
- PromptPilotError hierarchy with user-facing messages
- Configuration system with Zod schema and 5-source resolution
- Atomic file I/O with caching
- Pluggable LLM adapter interface with OpenAI and Anthropic implementations
- Retry logic with exponential backoff
- Validation engine (structural + markdown)
- Pipeline state detection and context assembly
- CLI skeleton with init, run, validate, config, status commands
- 9 prompt templates and pipeline manifest
- Project scaffold templates
