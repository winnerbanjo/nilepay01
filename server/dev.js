import { spawn } from 'node:child_process';

const processes = [
  spawn(process.execPath, ['server/index.js'], { stdio: 'inherit' }),
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev:web'], { stdio: 'inherit' }),
];

function stop() {
  processes.forEach((child) => child.kill('SIGTERM'));
}

processes.forEach((child) => {
  child.on('exit', (code) => {
    if (code && code !== 0) process.exitCode = code;
    stop();
  });
});

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
