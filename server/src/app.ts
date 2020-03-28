import * as fastify from "fastify";
import * as path from "path";
import * as chalk from "chalk";
import { Server, IncomingMessage, ServerResponse } from "http";
import router from "./router";

const debug = require("debug")("frost-tools:server");
const serverOptions: fastify.ServerOptions = {
  // Logger only for production
  logger: {
    prettyPrint: {
      colorize: chalk.supportsColor,
      crlf: true,
      errorLikeObjectKeys: ["err", "error"],
      errorProps: "",
      levelFirst: true,
      messageKey: "msg",
      translateTime: "mmmm dS @ h:MM:ss TT Z",
      ignore: "pid,hostname"
    },
    redact: ["req.headers", "req.body"]
  },
  ignoreTrailingSlash: true
};

const port = parseInt(process.env.PORT, 10) || 8000;
const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify(serverOptions);

const tesla = require("./tesla.ts");
const utilities = require("./utilities.ts");

class SwaggerService {
  constructor() {}

  // Tesla
  teslaAuthNew(request, reply) {
    return tesla.auth.new(request, reply);
  }
  teslaAuthRefresh(request, reply) {
    return tesla.auth.refresh(request, reply);
  }
  teslaAuthDelete(request, reply) {
    return tesla.auth.delete(request, reply);
  }

  // Utilities
  encrypt(request, reply) {
    return utilities.encryptAPI(request, reply);
  }
  decrypt(request, reply) {
    return utilities.decryptAPI(request, reply);
  }
  week(request, reply) {
    return utilities.week(request, reply);
  }
}

const swaggerCombine = require("swagger-combine");

swaggerCombine(`${__dirname}/static/spec/frost.tools.yaml`)
  .then(res => {
    app.register(require("fastify-openapi-glue"), {
      specification: res,
      service: new SwaggerService()
    });

    app.register(require("fastify-helmet"));
    app.register(require("fastify-sensible"));
    app.register(require("fastify-static"), {
      root: path.join(__dirname, "static")
    });
    app.register(router);

    app.listen(port, "0.0.0.0");
  })
  .catch(err => {
    throw err;
  });

export default app;
