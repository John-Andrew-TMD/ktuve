'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require('compression-webpack-plugin')
// 导入体积分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// 导入速度分析插件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// const webpack = require('webpack')
function resolve(dir) {
  return path.join(__dirname, dir)
}
// 判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  css: [
    'https://cdn.staticfile.org/element-ui/2.10.1/theme-chalk/index.css',
    '//at.alicdn.com/t/font_1212578_5t2hxnnky8o.css'
  ],
  js: [
    'https://cdn.staticfile.org/vue/2.6.10/vue.runtime.js',
    'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
    'https://cdn.staticfile.org/vue-router/3.0.1/vue-router.min.js',
    'https://cdn.staticfile.org/element-ui/2.12./index.js',
    'https://cdn.staticfile.org/axios/0.18.0/axios.min.js'
  ]
}

const name = defaultSettings.title || '' // page title
const port = 9527 // dev port
// const HOST = 'http://10.220.1.145:8080'
const HOST_COMMON = 'http://10.220.1.176'
// const HOST_COMMON = 'http://10.220.1.170'
// const HOST = 'http://10.220.10.78:8082'
// const BUSSINESS_HOST = 'http://10.220.10.78:8083'
// const HOST_COMMON = 'http://10.220.10.78:8080'
const FILEHOST = 'http://10.220.10.32:8080'
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  parallel: true,
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: isProduction && smp.wrap({
    name,
    // output: {
    //   chunkFilename: 'js/chunck.[contenthash:8].js'
    // },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        openAnalyzer: false
      }),
      new CompressionPlugin({
        test: /\.(js|html|css)$/,
        threshold: 10240,
        deleteOriginalAssets: false
      }),
      new ParallelUglifyPlugin({
        uglifyES: {
          output: {
            beautify: false,
            comments: false
          },
          compress: {
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ['console.log'],
            collapse_vars: true
          }
        }
      })
    ],
    mode: "development",
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios': 'axios'
    } || {},
    optimization: {
      splitChunks: {
        chunks: 'all',
        // minChunks: 2,
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          echarts: {
            name: 'chunk-echarts',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/
          },
          raphael: {
            name: 'chunk-raphael',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?raphael(.*)/
          },
          chinaRegion: {
            name: 'chunk-china-region',
            priority: 20,
            test: resolve('src/utils/china-address-2019.min.js')
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 2, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }
    }
  }) || {},
  chainWebpack: config => {
    // config.entry('index')
    // .add('babel-polyfill')
    // .end()
    config.output.globalObject('this')
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'))
      .set('views', resolve('src/views'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('service', resolve('src/service'))
      .set('mixins', resolve('src/mixins'))
      .set('directives', resolve('src/directives'))

    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config.optimization.runtimeChunk('single')
        }
      )
  },
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/ktfcp-portal-dev': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-portal-dev': '/ktfcp-portal-dev'
        }
      },
      '/ktfcp-workflow-dev': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-workflow-dev': '/ktfcp-workflow-dev'
        }
      },
      '/ktfcp-rzzl-run-dev': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-rzzl-run-dev': '/ktfcp-rzzl-run-dev'
        }
      },
      '/ktfcp-fileserver-dev': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-fileserver-dev': '/ktfcp-fileserver-dev'
        }
      },
      '/ktfcp-officeconvert-dev': {
        target: FILEHOST,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-officeconvert-dev': '/ktfcp-officeconvert-dev'
        }
      },
      '/ktfcp-adminserver-dev': {
        target: FILEHOST,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-adminserver-dev': '/ktfcp-adminserver-dev'
        }
      },
      '/ktfcp-zipkin-dev': {
        target: FILEHOST,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-zipkin-dev': '/ktfcp-zipkin-dev'
        }
      },
      '/ktfcp-TransactionManager-dev': {
        target: FILEHOST,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-TransactionManager-dev': '/ktfcp-TransactionManager-dev'
        }
      },
      '/ktfcp-koca-dict-dev': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/ktfcp-koca-dict-dev': '/ktfcp-koca-dict-dev'
        }
      },
      '/nacos': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/nacos': '/nacos/'
        }
      },
      '/swagger-ui.html': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/swagger-ui.html': '/swagger-ui.html'
        }
      },
      '/database': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/database': '/ktfcp-report-dev/database'
        }
      },
      '/workflow': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/workflow': '/ktfcp-workflow-dev/workflow'
        }
      },
      '/category': {
        target: HOST_COMMON,
        changeOrigin: true,
        pathRewrite: {
          '^/category': '/ktfcp-report-dev/category'
        }
      }
    }
  }
}
