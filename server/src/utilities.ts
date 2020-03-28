import * as fastify from "fastify";
import * as cryptoJS from "crypto-js";

const encrypt = (data, key) => {
  const encrypted = cryptoJS.AES.encrypt(data, key).toString();
  return encrypted || null
};

const encryptAPI = async (request, reply) => {
  const encrypted = encrypt(
    request.body.data,
    request.body.key
  )
  if (!encrypted) reply.badRequest("Unable to encrypt this data");
  reply.send({ encrypted });
};

const decrypt = (data, key) => {
  const bytes = cryptoJS.AES.decrypt(data, key);
  const decrypted = bytes.toString(cryptoJS.enc.Utf8);
  return decrypted || null
};

const decryptAPI = async (request, reply) => {
  const decrypted = decrypt(request.body.data, request.body.key);
  if (!decrypted) reply.unauthorized("The data and key are incompatible");
  reply.send({ decrypted });
};

const week = async (request, reply) => {
  const dateFormat = require("dateformat");
  const now = new Date();
  reply.send(dateFormat(now, "W"));
};

module.exports = {
  encrypt,
  encryptAPI,
  decrypt,
  decryptAPI,
  week
};
