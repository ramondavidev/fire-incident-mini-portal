#!/usr/bin/env node
/**
 * Cross-platform setup script.
 * Installs root, frontend and backend dependencies and optionally starts the dev servers.
 * Usage:
 *   node ./scripts/setup-and-run.js        # installs and starts dev servers
 *   node ./scripts/setup-and-run.js --no-start  # only installs
 */

const { spawnSync, spawn } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

function runSync(cmd, args, opts = {}) {
  console.log(`[setup] $ ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, opts));
  if (res.error) {
    console.error('[setup] error:', res.error);
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error(`[setup] command exited with code ${res.status}`);
    process.exit(res.status);
  }
}

function exists(p) {
  return existsSync(path.resolve(process.cwd(), p));
}

function main() {
  const args = process.argv.slice(2);
  const noStart = args.includes('--no-start') || args.includes('-n');

  // Root install
  runSync('npm', ['install']);

  // Frontend
  if (exists('./frontend/package.json')) {
    console.log('[setup] Installing frontend dependencies...');
    runSync('npm', ['install'], { cwd: path.resolve(process.cwd(), 'frontend') });
  } else {
    console.log('[setup] Skipping frontend install (no ./frontend/package.json)');
  }

  // Backend
  if (exists('./backend/package.json')) {
    console.log('[setup] Installing backend dependencies...');
    runSync('npm', ['install'], { cwd: path.resolve(process.cwd(), 'backend') });
  } else {
    console.log('[setup] Skipping backend install (no ./backend/package.json)');
  }

  if (noStart) {
    console.log('[setup] Install finished. Skipping start because --no-start was passed.');
    process.exit(0);
  }

  // Start dev (long-running)
  console.log('[setup] Starting development servers (press Ctrl+C to stop)...');
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  // Forward signals
  const forward = (sig) => {
    if (child && !child.killed) {
      try { child.kill(sig); } catch (e) {}
    }
  };
  process.on('SIGINT', () => forward('SIGINT'));
  process.on('SIGTERM', () => forward('SIGTERM'));

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[setup] dev process terminated with signal ${signal}`);
      process.exit(1);
    }
    console.log(`[setup] dev process exited with code ${code}`);
    process.exit(code);
  });
}

main();
