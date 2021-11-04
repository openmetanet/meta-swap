const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const HOST=process.env.VUE_APP_httpUrl
const Timestamp = Math.round(new Date().getTime() / 1000);
module.exports={
    chainWebpack: config => {
        if (isProduction) {
          config.plugin("html").tap(args => {
            args[0].title='MetaCoin Swap'
            args[0].minify = false;
            return args;
          });
        }else{
          config.plugin("html").tap(args => {
            args[0].title='MetaCoin Swap'
            return args;
          })
        }
    },
    configureWebpack: {
      output: {
        // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
        filename: `[name].${Timestamp}.js`,
        chunkFilename: `[name].${Timestamp}.js`
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                drop_console: isProduction ? true : false, //console
                drop_debugger: false,
                pure_funcs: isProduction ? ["console.log"] : [] //移除console
              }
            }
          })
        ]
      },
      plugins: [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      ],
    
      resolve: {
          // 别名
          alias: {
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@views": path.resolve(__dirname, "./src/views"),
            "@c": path.resolve(__dirname, "./src/components"),
            "@metaid": path.resolve(__dirname, "./src/metaid"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@filters": path.resolve(__dirname, "./src/filters")
          }
        }
      },
      css:{
        loaderOptions: {
          scss: {
            prependData: `@import "~@/assets/scss/global.scss";`
          }
        }
      },
    lintOnSave: false,
    devServer:{
        overlay: {
            warnings: false,
            errors: false
          },
        hot:true,
        hotOnly:true,
        host:'',
        port:443,
        https: true,
        disableHostCheck: true,
        proxy:{
          "/api/": {
            target: process.env.VUE_APP_WALLET_API,
            changeOrigin: true,
            pathRewrite: {
              "^/api/": ""
            }
          },
          "/showmoney/": {
                target: process.env.VUE_APP_WALLET_API,
                changeOrigin: true,  
          },
        
        }
       

        }
}