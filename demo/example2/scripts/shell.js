const fs = require('node:fs')
const { execSync } = require('child_process');
const path = require('path');

const RootPath = path.join(__dirname, '..')
const SrcPath = path.join(RootPath, 'src')

const cli = path.normalize(path.join(RootPath, 'node_modules', '.bin', 'rxluag-cli'))

const fmt = (d) => d.toLocaleString('sv').replaceAll(':', '-').replaceAll(' ', '_').slice(0, 19)
const ct = fmt(new Date())

const inputPath = path.join(SrcPath, 'main.lua')
const spritesPath = path.join(__dirname, 'rxlua-cli', 'sprites.js')

const shArray = [
  cli,
  '-i', inputPath,
  '--output', `output_${ct}.lua`,
  '--sprites', spritesPath
]

const sh = shArray.join(' ')
console.log('sh=\n', sh, '\n')


const result = execSync(sh, { stdio: 'inherit' })
console.log('\n\n result=', result)