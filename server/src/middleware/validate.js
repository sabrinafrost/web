const { check, validationResult } = require('express-validator')

const request = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    res.status(400).json({ errors: errors.array() })
  }
}

const data = (data, rules) => {
  const validate = require('validate.js')
  const validation = validate(data, rules, { format: 'flat' })
  if (validation) return validation
  return false
}

module.exports = {
  request,
  data,
  check
}
