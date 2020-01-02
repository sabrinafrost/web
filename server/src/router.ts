import tesla from "./tesla";
import * as utilities from "./utilities";

export default function router(fastify, opts, next) {
  fastify.get("/", (request, reply) => reply.sendFile('documentation.html'));
  fastify.get("/spec", (request, reply) => reply.type("application/json").sendFile('common/reference/frost.tools.v1.yaml'));

  fastify.post("/tesla/auth", tesla.auth.new)
  fastify.put("/tesla/auth", tesla.auth.refresh)
  fastify.delete("/tesla/auth", tesla.auth.delete)
  fastify.get("/tesla/command", tesla.command)
  
  fastify.post("/encrypt", utilities.encrypt)
  fastify.post("/decrypt", utilities.decrypt)
  fastify.get("/week", utilities.week)

  next();
}
