#!/usr/bin/env node
const { execSync, spawnSync } = require('child_process');
const path = require('path');

function listFiles() {
  try {
    const out = execSync('git ls-files -- "*.ts" "*.json" "*.md"', { encoding: 'utf8' });
    return out.split(/\r?\n/).filter(Boolean);
  } catch (err) {
    return [];
  }
}

const files = listFiles();
if (!files.length) process.exit(0);

const prettierCli = require.resolve('prettier/bin/prettier.cjs');
const res = spawnSync(process.execPath, [prettierCli, '--check', ...files], { stdio: 'inherit' });
process.exit(res.status);
