import type { Command } from 'commander'

export function registerInitCommand(program: Command): void {
  program
    .command('init [project-name]')
    .description('Scaffold a new PromptPilot project')
    .option('-d, --description <desc>', 'One-line product description')
    .option('-a, --audience <audience>', 'Target audience')
    .option('-p, --platform <platform>', 'Target platform')
    .option('--domain <domain>', 'Industry domain')
    .option('--yes', 'Skip prompts, use defaults or flag values')
    .action(async (projectName, _options) => {
      // eslint-disable-next-line no-console
      console.log(`[INFO] init: ${projectName || 'prompting for name...'}`)
      // Implemented in Phase 1
    })
}
