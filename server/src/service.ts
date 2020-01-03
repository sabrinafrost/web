import tesla from "./tesla";
import * as utilities from "./utilities";

class Service {
  constructor() {}

  async teslaAuthNew (request, reply) { return tesla.auth.new(request, reply) }
  async teslaAuthRefresh (request, reply) { return tesla.auth.refresh(request, reply) }
  async teslaAuthDelete (request, reply) { return tesla.auth.delete(request, reply) }

  async encrypt (request, reply) { return utilities.encrypt(request, reply) }
  async decrypt (request, reply) { return utilities.decrypt(request, reply) }
  async week    (request, reply) { return utilities.week(request, reply) }

}

module.exports = config => new Service();