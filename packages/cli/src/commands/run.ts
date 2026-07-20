import type { Command } from 'commander'

export function registerRunCommand(program: Command): void {
  program
    .command('run [step]')
    .description('Execute pipeline steps')
    .option('--all', 'Run the entire pipeline')
    .option('--parallel', 'Run independent steps in parallel')
    .option('--yes', 'Skip confirmation prompts')
    .option('--force', 'Overwrite existing artifacts')
    .option('--dry-run', 'Simulate without calling LLM')
    .option('--verbose', 'Show detailed output')
    .option('--model <model>', 'Override LLM model')
    .option('--temperature <temp>', 'Override temperature', parseFloat)
    .action(async (step, options) => {
      // eslint-disable-next-line no-console
      console.log(`[INFO] run: step=${step || 'auto'}, all=${options.all}`)
      // Implemented in Phase 1
    })
}
