# MetaSwap
MetaSwap 是通过 metaID 结合 sensible 感应合约编写的一个 FT-Token 兑换站

### 项目运行

```shell
npm install
开发环境 npm run dev
生产环境 npm run prod
生产环境打包 npm run build
```

### 项目目录结构

```
.
|-- dist                             // 编译后文件目录
|-- .env.production                  // 项目环境变量配置
|-- src                              // 源码目录
|   |-- assets                       // 各种资源文件
|       |-- css                    // 样式表文件夹
|           |-- reset.css            // css 重置文件
|       |-- scss                    // 样式表文件夹
|           |-- global.scss            // scss 样式入口文件
|       |-- images                   // 静态图片文件夹
|       |-- lang                    // 多语言配置文件
|   |-- components                   // 公共组件
|       |--
|   |-- views                        // 页面组件
|       |-- xxx.vue
|   |-- router                       // 路由配置和程序的基本信息配置
|       |-- index.js                 // 配置页面路由
|   |-- public                     // html模板目录
|       |-- index.html
|   |-- api                         // 接口api
|       |-- api.js                  // 二次封装axios后的接口方法，暴露使用
|   |-- store                        // vuex的状态管理
    |-- filters                        // 全局过滤器
    |       |-- index.js
|   |-- utils                       // 公共方法
|       |-- calcSwapFee.js          // swap兑换时的计算方法
|-- README.md                        // 项目说明
|-- package.json                     // 配置项目相关信息
.
```

### 配置说明
.env.development 和 .env.production 为环境变量配置文件，可以根据需要配置以下环境变量：
```js
  VUE_APP_WALLET_API = 'https://api.showmoney.app/'  // 钱包 api 的转发地址

  VUE_APP_IMGURL = 'https://showman.showpay.io/metafile/' // metafile 文件格式的解析地址

  VUE_APP_AUTH_URL = 'https://www.showmoney.app/' // showmoney 钱包的 url

  VUE_APP_AVATARURL = 'https://showman.showpay.io/metafile/avatar/' // metaId 头像解析的路径,avatar/后面跟用户的 metaId

  VUE_APP_NETWORK='mainnet' // 主网标识"mainnet",sensible 不支持测试网

  VUE_APP_WHATS_ON_CHAIN = 'https://whatsonchain.com/tx/' // 区块浏览器地址

  VUE_APP_httpUrl = '' // 项目的域名地址(开发者自行配置,登录 showmoney 网页钱包:https://www.showmoney.app/open即可配置)

  VUE_APP_appClientId = '' // 应用的 ClientId(开发者自行配置)

  VUE_APP_appClientSecret = '' // 应用的 ClientSecret(开发者自行配置)

  VUE_APP_redirectUri = 'https://www.showmoney.app' // oAuth2 要跳转授权的地址，固定写死

  VUE_APP_redirectUrl = 'https://api.showmoney.app' // 钱包 api 的转发地址
```
- vue.config.js 中的 host 为开发阶段的主机名，要求开发阶段配置为与 VUE_APP_httpUrl 一致，否则会导致登录后跳转页面失败的情况，项目已内置好完善的登录逻辑和 sensible 调用合约方法，开箱即用

