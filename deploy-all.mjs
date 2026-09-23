import { readFileSync, writeFileSync, cpSync, rmSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const BASE_FORM = '5b5902bb-7918-4efd-9116-00b746d08b77'
const partners = JSON.parse(readFileSync('partners.json', 'utf8'))
const only = process.argv[2] ? process.argv.slice(2) : null
const list = only ? partners.filter((p) => only.includes(p.slug)) : partners

mkdirSync('out', { recursive: true })
const LOG = 'deploy-urls.txt'

for (const { slug, form } of list) {
  const dir = `out/${slug}`
  rmSync(dir, { recursive: true, force: true })
  cpSync('dist', dir, { recursive: true })

  const htmlPath = `${dir}/index.html`
  const html = readFileSync(htmlPath, 'utf8')
  if (!html.includes(BASE_FORM)) throw new Error(`form-id base nao encontrado em ${slug}`)
  writeFileSync(htmlPath, html.split(BASE_FORM).join(form))

  const project = `mig-lp-${slug}`
  let out = ''
  try {
    out = execFileSync(
      'npx',
      ['vercel', 'deploy', dir, '--prod', '--yes', '--scope', 'mig-tech', '--name', project],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: true },
    )
  } catch (e) {
    out = `${e.stdout || ''}${e.stderr || ''}`
  }
  const url = (out.match(/https:\/\/[a-z0-9-]+\.vercel\.app/g) || []).pop() || 'FALHOU'
  const line = `${slug}\t${form}\thttps://${project}.vercel.app\t${url}`
  console.log(line)
  appendFileSync(LOG, line + '\n')
}
