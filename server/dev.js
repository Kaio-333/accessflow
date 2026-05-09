import { spawn } from 'node:child_process'
import { createProxyServer } from './proxy-server.js'

const proxy = createProxyServer({ port:5174 })

const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: false,
})

function shutdown(code = 0) {
  proxy.close(() => process.exit(code))
  vite.kill()
}

vite.on('exit', code => shutdown(code ?? 0))
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
