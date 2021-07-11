const assert = require('assert')

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base')
  // console.log(baseConfig)
  it ('entry', () => {
    assert.equal(baseConfig.entry.index, '/Users/liwenjing/Documents/myproject/my-webpack/npm-project/test/smoke/template/src/index.js')
    assert.equal(baseConfig.entry.search, '/Users/liwenjing/Documents/myproject/my-webpack/npm-project/test/smoke/template/src/search.js')
  })
})