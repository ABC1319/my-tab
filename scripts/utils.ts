/* eslint-disable node/prefer-global/process */
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bgCyan, black } from 'kolorist'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const port = Number.parseInt(process.env.PORT || '') || 3303
export const r = (...args: string[]) => resolve(__dirname, '..', ...args)
export const isDev = process.env.NODE_ENV !== 'production'
export const isFirefox = process.env.EXTENSION === 'firefox'

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}
