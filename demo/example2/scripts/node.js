const pathJoin = require('path').join
const rxluagcli = require('rxluag-cli')
const pk = require('../package.json')

const rootPath = pathJoin(__dirname, '..')
const srcPath = pathJoin(rootPath, 'src')

const luaPath = pathJoin(srcPath, 'main.lua')
const AssetsPath = pathJoin(srcPath, 'test_assets')

const output = pk.name + '.lua'

rxluagcli({
  rootPath: srcPath,
  input: luaPath,
  output,
  // encryption: false,
  // logEnable: false,

  zipAssetsUse: true,
  zipAssetsFolder: AssetsPath,

  replaces: {  // repeat-1
    'rxprint': '_r_x_bbb_00002'
  },
  obfuscator: [
    'util'
  ],
  sprites: [
    'return util'
  ]
}).then(res => {
  console.log('-----结果-----')
  console.log(res)
}).catch(error => {
  console.log('error\n', error)
})