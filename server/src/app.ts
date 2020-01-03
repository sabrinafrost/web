import * as fastify from "fastify";
import * as path from 'path'
import * as chalk from 'chalk'
import { Server, IncomingMessage, ServerResponse } from "http";
import router from "./router";

const serverOptions: fastify.ServerOptions = {
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
  ignoreTrailingSlash: true
};

const port = parseInt(process.env.PORT, 10) || 8000;
const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(serverOptions);
const openApiOptions = {
  specification: `${__dirname}/assets/common/reference/frost.tools.v1.yaml`,
  service: `${__dirname}/service.${process.env.NODE_ENV === 'development' ? `ts` : `js`}`
};

app.register(require('fastify-sensible'))
app.register(require('fastify-helmet'))
app.register(require("fastify-openapi-glue"), openApiOptions);
app.register(router);
app.register(require('fastify-static'), { root: path.join(__dirname, 'assets') })

app.listen(port, '0.0.0.0', (err, address) => {
  if (err) throw err
  console.log(chalk`⭐️  {cyan.bold Frost Server} is {italic chillin'} on port: {bold ${port}} ⭐️`);
})

export default app;
