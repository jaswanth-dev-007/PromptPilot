#!/usr/bin/env node
import { Command } from 'commander'
import { registerInitCommand } from './commands/init'
import { registerRunCommand } from './commands/run'
import { registerValidateCommand } from './commands/validate'
import { registerConfigCommand } from './commands/config'
import { registerStatusCommand } from './commands/status'

const program = new Command()

program
  .name('promptpilot')
  .description('AI-powered software planning pipeline — go from idea to complete spec suite')
  .version('0.1.0')
  .option('--no-color', 'Disable color output')
  .option('--plain', 'Plain text output (screen-reader friendly)')

registerInitCommand(program)
registerRunCommand(program)
registerValidateCommand(program)
registerConfigCommand(program)
registerStatusCommand(program)

program.parse()
