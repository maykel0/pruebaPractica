const MessageRepositoryPort = require("../../../domain/repositories/MessageRepositoryPort");

/**
 * Adaptador: InMemoryMessageRepository
 * Implementa MessageRepositoryPort guardando los mensajes en un arreglo
 * en memoria. Para el proyecto de clase es suficiente; el dia que se
 * necesite persistencia real (Postgres, Mongo, etc.) solo se crea OTRO
 * adaptador que cumpla el mismo puerto, sin tocar los casos de uso.
 */
class InMemoryMessageRepository extends MessageRepositoryPort {
  constructor() {
    super();
    this._messages = [];
  }

  async save(message) {
    this._messages.push(message);
    return message;
  }

  async findByConversation(phoneNumberA, phoneNumberB) {
    return this._messages.filter((m) => {
      const participants = [m.from.value, m.to.value];
      return (
        participants.includes(phoneNumberA.value) &&
        participants.includes(phoneNumberB.value)
      );
    });
  }

  async findAll() {
    return this._messages;
  }
}

module.exports = InMemoryMessageRepository;
