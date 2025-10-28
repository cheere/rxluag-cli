# lua 源码混淆


目前都是简单的 文本替换


## 应用
- 触动精灵

## 描述
- `-i main.lua`: 入口文件 所有`require("xxx")`的代码，整合到一个新的文件中
- `assets`: 这个是我的需要，把当前目录的 所有`*.png`文件放入到`assets`中

# 一、需要被打包的环境
- 所有 `*.lua` 、 `*.png` 都需要再同一个级 目录(文件夹) 下

> <b>所有文件代码汇总一个文件</b>
- 先声明
- 后使用
- 每个文件 的全局变量，不能重复， `可以用 table 变量内部中定义 -- 结构体变量`
- 每个文件的方法(函数)，不能重复 `可以定义 table:函数名  --> 结构体函数`

# 二、使用

## shell

```sh
#sh

  # 安装
  npm install -D rxlua-cli
```

```sh
#sh

  # 命令方式
  rxlua-cli -i ./main.lua
  # -v, --version       版本
  # -i, --input         <filePath - .lua> 当前目录 main.lua *** 必须传
  # -rp, --rootPath     project root directory, 当前项目根目录
  # -o, --output        <fileName - .lua> 输出文件名: 默认 main.lua
  # -z, --zip:          <fileName - .zip> zip压缩包名：默认 2024-12-01_1234567.zip
  # -r, --replaces      <filePath - .js>
  # -e, --encryption    <true / false> 代码混淆压缩(encryption code) <default true>
  # --libs              <filePath - .js> require() 导入的库，不进行文件读取
  # -s, --sprites       <filePath - .js> 不要的代码，都删除掉
  # -obf, --obfuscator  <filePath - .js> 需要被混淆的字符串 <- 数组 <- .js文件
  # -zaf, --zip-assets-folder  <filePath - dir>
  # -zau, --zip-assets-use     <true /false>

  rxlua-cli -i ./main.lua -o rx.lua

  rxlua-cli -i ./main.lua -o rx2.lua -z rxlua.zip
```

## nodejs

```js
//js
  // import rxluagcli from 'rxluag-cli/dist/index.amd.js'
  const rxluagcli = require('rxluag-cli')

  // 01
  const opt = {
    input: path.join(process.cwd(), 'main.lua'), // filePath + filename <lua>
    // rootPath: path.join(process.cwd()),   // project root directory, 当前项目根目录
    // output: 'update.lua',                 // filename <lua>
    // zip: 'update.zip',                    // filename <zip>
    // encryption: true/false                // encryption code <default true>
    // replaces: {} || 'config/replaces.js'  // filePath + filename <js>
    // libs: [] || 'config/libs.js',         // filePath + filename <js>
    // sprites: [] || 'config/sprite.js',    // filePath + filename <js>
    // obfuscator: [] || 'config/obfs.js',   // filePath + filename <js>
    // zipAssetsFolder: './x/x/assets'       // filePath (dir)
    // zipAssetsUse: true/false              // default true
  }

  rxluagcli(opt).then(res => {
    console.log(res)
  }).catch(error => {
    console.log('error\n', error)
  })

  // config/libs.js  -- 系统库、平台库(除了自己写的源码，都需要写)
  //                 require() 导入的库，不进行文件读取
  module.exports = ['TSLib', ...]

  // config/sprite.js -- Delete unnecessary code（不要的代码，都删除掉）
  module.exports = ['return RxTable', ...]

  // config/obfs.js -- Obfuscate names for replacement（混淆名字，用于替换）
  module.exports = ['RxFwUi', ...]

  // 02
  const opt = {
    input: './../input.main', // only string
    // replaces   // path string || Object<key,value>
    // libs       // path string || Array<string>
    // sprites    // path string || Array<string>
    // obfuscator // path string || Array<string>
  }

  // 03
  const opt = {
    input: 'input.main', // == path.join(process.cwd(), 'main.lua')
    // replaces   // path string || Object<key,value>
    // libs       // path string || Array<string>
    // sprites    // path string || Array<string>
    // obfuscator // path string || Array<string>
  }

  // 04 -- Nodejs Object
  const opt {
    input: 'input.main',
    replaces: {rxluaccc: '_r_l_c'},
    libs: ['RxSpySo', ...],
    sprites: ['return RxLuaUtils', ...],
    obfuscator: ['__t_eee', ...]
  }

  // 05 - require file.js
  const opt {
    input: 'input.main',
    replaces: './config/replaces.js', // require loading
    libs: './config/libs.js', // require loading
    sprites: './config/sprites.js', // require loading
    obfuscator: './config/obfuscator.js', // require loading
  }
  /**
   * ./config/libs.js
   * ----- file content ----
    module.exports = [
      'return RxLuaUtils'
    ]
   */
```

# 三、说明

```lua
--lua
  -- config/sprite.js
  -- Could you explain why this file is necessary（为什么会有这个文件）

  -- example 例如
  -- a.lua
  local aa = {}
  function aa:get()
  -- ...
  end
  function aa:set()
  -- ...
  end
  return aa

  -- 如果 把a.lua 合并到main.lua，这个返回就太早了
```

<hr>

```lua
--lua
  -- config/libs.js
  -- Could you explain why this file is necessary（为什么会有这个文件）

  -- example（例如）
  require('abc')
  -- To copy the code from ./abc.lua to main.lua
  -- 会从 ./abc.lua源码内容 复制到 main.lua

  require('TsLib')
  -- This must be kept as the original."
  -- 这个需要保持原样

  -- Supports formatting styles
  -- 支持 格式样式
  require 'abc'
  require'abc'
  require('abc')
  require ('ab')
```

# 四、source code - execution order（源码 - 执行顺序）
1. `-i`,`--input`
1. `libs`、`sprites`
1. `--encryption`=true --> `--obfuscator`
1. `--replaces`
1. `--output`
1. `--zip-assets-folder` -> `--zip-assets-use`
1. `--zip`

# 五、question (问题)
- Define before use.（先定义, 后使用）
- First require the module, then call the custom method <function>.（先`require`导入操作, 再去调用自写方法<函数>）
- Be sure to take note of the order of the requires. (一定要注意 require 顺序)

# 六、libs - default
- `TSLib` // TSLib.so
- `ts`    // ts.so
- `tsnet` // tsnet.so
- `tsimg` //tsimg.so 图片二值化
- `thread`
- `event`  // webview
- `webview`
- `socket`
- `socket.http`

- `sz`
- `szocket`
- `szocket.http`
- `szocket.core`

- `tsqr`
- `ts_enterprise_lib`
- `vpncfg`
- `ltn12`
- `luasql.mysql`

