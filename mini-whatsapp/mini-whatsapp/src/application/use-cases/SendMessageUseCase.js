const Message = require("../../domain/entities/Message");
const PhoneNumber = require("../../domain/value-objects/PhoneNumber");
const MessageContent = require("../../domain/value-objects/MessageContent");

/**
 * Caso de uso: SendMessageUseCase
 *
 * Orquesta el envio de un mensaje. Depende SOLO de los puertos (abstracciones),
 * nunca de una implementacion concreta. Esto es lo que permite cambiar entre
 * el adaptador "mock" y el adaptador "whatsapp" sin tocar esta clase.
 *
 * Responsabilidad unica (SRP): coordinar el flujo de "enviar mensaje",
 * nada mas (no valida HTTP, no arma respuestas JSON, etc).
 */
class SendMessageUseCase {
  /**
   * @param {import('../../domain/repositories/MessageRepositoryPort')} messageRepository
   * @param {import('../../domain/services/MessagingGatewayPort')} messagingGateway
   */
  constructor(messageRepository, messagingGateway) {
    this.messageRepository = messageRepository;
    this.messagingGateway = messagingGateway;
  }

  async execute({ from, to, text }) {
    const fromNumber = new PhoneNumber(from);
    const toNumber = new PhoneNumber(to);
    const content = new MessageContent(text);

    const message = new Message({
      from: fromNumber,
      to: toNumber,
      content,
      direction: "outgoing",
    });

    try {
      await this.messagingGateway.sendMessage(toNumber, content);
      message.markAsSent();
    } catch (err) {
      message.markAsFailed();
      await this.messageRepository.save(message);
      throw err;
    }

    await this.messageRepository.save(message);
    return message.toPrimitives();
  }
}

module.exports = SendMessageUseCase;
