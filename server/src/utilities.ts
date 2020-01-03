import * as cryptoJS from 'crypto-js';
import * as fastify from "fastify";

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
  let now: any = new Date();
  let onejan: any = new Date(now.getFullYear(), 0, 1);
  let week: number = Math.ceil( (((now - onejan) / 86400000) + onejan.getDay() + 1) / 7 );
  reply.send({ week: week })
};