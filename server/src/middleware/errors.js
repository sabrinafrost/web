const createError = require('http-errors')

const response = {
  json: error => {
    return {
      error: {
        status: error.status || 500,
        message: error.message === '' ? 'Unknown error' : error.message
      }
    }
  }
}

const redirect = (req, res, next) => {
  next(createError(404))
}

const log = (error, req, res, next) => {
  // eslint-disable-next-line no-console
  // console.error(error)
  next(error)
}

const render = (error, req, res, next) => {
  res.locals.error = error

  if (error.status >= 100 && error.status < 600) res.status(error.status)
  else res.status(500)

  if (req.method === 'POST') res.json(response.json(error))
  else res.render('error')
}

module.exports = {
  new: createError,
  redirect,
  log,
  render,
  response
}
