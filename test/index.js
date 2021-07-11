const path = require('path')

process.chdir(path.join(__dirname, 'smoke/template'))

describe('npm-project test case', () => {
  require('./unit/webpack-base-test');
})