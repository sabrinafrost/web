const cryptoJS = require('crypto-js')
const validate = require('./validate')

const constraints = {
  encrypt: {
    key: { presence: { message: 'Missing encryption key' } },
    input: { presence: { message: 'No data to encrypt because input is missing' } }
  },
  decrypt: {
    key: { presence: { message: 'Missing decryption key' } },
    input: { presence: { message: 'No data to decrypt because input is missing' } }
  }
}

const encrypt = (input, key) => {
  validate.data({ key, input }, constraints.encrypt)
  const encrypted = cryptoJS.AES.encrypt(input, key).toString()
  return { encrypted }
}

const decrypt = (input, key) => {
  validate.data({ key, input }, constraints.decrypt)
  const bytes = cryptoJS.AES.decrypt(input, key)
  const decrypted = bytes.toString(cryptoJS.enc.Utf8)
  if (!decrypted) return { error: 'Unable to decrypt this data' }
  return { decrypted }
}

module.exports = {
  constraints,
  encrypt,
  decrypt
}
