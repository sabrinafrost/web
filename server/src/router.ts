import { welcome, spec } from "./handlers";

export default function router(fastify, opts, next) {
  fastify.get("/", welcome);
  fastify.get("/spec", spec);
  next();
}
