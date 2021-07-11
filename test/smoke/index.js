// 构建脚本
const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const moCha = require('mocha')

const mocha = new moCha({
  timeout: '10000ms'
})

// 进入template目录
process.chdir(path.join(__dirname, 'template'))

rimraf('./dist', () => {
  const prodConfig = require('../../lib/webpack.prod')
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.err(err)
      process.exit(1)
    }
    console.log(stats.toString({
      color: true,
      modules: false,
      children: false
    }))
    console.log('webpack build successfull, begin run test')
    mocha.addFile(path.join(__dirname, 'html-test.js'))
    mocha.addFile(path.join(__dirname, 'css-test.js'))
    mocha.run()
  })
})