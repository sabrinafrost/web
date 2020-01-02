import * as cryptoJS from 'crypto-js';
const fastify = require('fastify')()

export async function encrypt(request, reply) {
  const encrypted = cryptoJS.AES.encrypt(request.body.data, request.body.key).toString()
  if (!encrypted) reply.badRequest('Unable to encrypt this data')
  reply.send({ encrypted });
}

export async function decrypt(request, reply) {
  const bytes = cryptoJS.AES.decrypt(request.body.data, request.body.key)
  const decrypted = bytes.toString(cryptoJS.enc.Utf8)
  if (!decrypted) reply.badRequest('Unable to decrypt this data')
  reply.send({ decrypted });
}
