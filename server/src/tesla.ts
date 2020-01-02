export default {
  auth: {
    new: async (request, reply) => {
      reply.send({ response: 'new' });
    },
    refresh: async (request, reply) => {
      reply.send({ response: 'refresh' });
    },
    delete: async (request, reply) => {
      reply.send({ response: 'delete' });
    },
  },
  command: async (request, reply) => {
    reply.send({ response: 'command' });
  }
}