import type { Command } from 'commander'

export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .description('Show pipeline status')
    .action(async () => {
      // eslint-disable-next-line no-console
      console.log('[INFO] status')
      // Implemented in Phase 2 (P1)
    })
}
