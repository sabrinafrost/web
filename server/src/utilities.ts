import * as fastify from "fastify";
import * as cryptoJS from 'crypto-js';

export async function encrypt(request, reply) {
  const encrypted = cryptoJS.AES.encrypt(request.body.data, request.body.key).toString()
  if (!encrypted) reply.badRequest('Unable to encrypt this data')
  reply.send({ encrypted });
}

export async function decrypt(request, reply) {
  const bytes = cryptoJS.AES.decrypt(request.body.data, request.body.key)
  const decrypted = bytes.toString(cryptoJS.enc.Utf8)
  if (!decrypted) reply.unauthorized('The data and key are incompatible')
  reply.send({ decrypted });
}

export async function week(request, reply) {
  const dateFormat = require('dateformat');
  const now = new Date();
  reply.send({ week: dateFormat(now, "W") })
};