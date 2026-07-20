import type { Command } from 'commander'

export function registerConfigCommand(program: Command): void {
  const configCmd = program.command('config').description('Manage PromptPilot configuration')

  configCmd
    .command('init')
    .description('Interactive configuration wizard')
    .action(async () => {
      // eslint-disable-next-line no-console
      console.log('[INFO] config init: launching interactive wizard...')
    })

  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(async (_key, _value) => {
      // eslint-disable-next-line no-console
      console.log(`[INFO] config set: ${_key}=${_value}`)
    })

  configCmd
    .command('get <key>')
    .description('Get a configuration value')
    .action(async _key => {
      // eslint-disable-next-line no-console
      console.log(`[INFO] config get: ${_key}`)
    })

  configCmd
    .command('list')
    .description('List all configuration values')
    .action(async () => {
      // eslint-disable-next-line no-console
      console.log('[INFO] config list')
    })
}
