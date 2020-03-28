const glob = require('glob')
const path = require('path')
const camelCase = require('lodash.camelcase')
const middleware = {}

glob.sync('./middleware/**/!(index)*.js').forEach(file => {
  const filePath = path.resolve(file)
  const fileName = camelCase(path.basename(file, '.js'))
  middleware[fileName] = require(filePath)
})

module.exports = middleware
