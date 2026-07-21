/**
 * Puerto (interfaz): MessageRepositoryPort
 *
 * En arquitectura Hexagonal, el dominio define QUE necesita (este puerto)
 * sin saber COMO se implementa (eso lo decide infrastructure/adapters).
 * Esto aplica el Principio de Inversion de Dependencias (la "D" de SOLID):
 * las capas internas no dependen de las externas, es al reves.
 */
class MessageRepositoryPort {
  async save(_message) {
    throw new Error("MessageRepositoryPort.save() no implementado");
  }

  async findByConversation(_phoneNumberA, _phoneNumberB) {
    throw new Error("MessageRepositoryPort.findByConversation() no implementado");
  }

  async findAll() {
    throw new Error("MessageRepositoryPort.findAll() no implementado");
  }
}

module.exports = MessageRepositoryPort;
