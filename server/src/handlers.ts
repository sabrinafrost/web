export async function welcome(request, reply) {
  reply.sendFile('documentation.html')
}

export async function spec(request, reply) {
  reply.type("application/json").sendFile('common/reference/frost.tools.v1.yaml');
}
