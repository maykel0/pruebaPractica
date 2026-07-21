const Message = require("../../domain/entities/Message");
const PhoneNumber = require("../../domain/value-objects/PhoneNumber");
const MessageContent = require("../../domain/value-objects/MessageContent");

/**
 * Caso de uso: ReceiveMessageUseCase
 * Se ejecuta cuando el adaptador de mensajeria detecta un mensaje entrante
 * (evento "message" de whatsapp-web.js, o un POST simulado del mock).
 */
class ReceiveMessageUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute({ from, to, text }) {
    const message = new Message({
      from: new PhoneNumber(from),
      to: new PhoneNumber(to),
      content: new MessageContent(text),
      direction: "incoming",
      status: "delivered",
    });

    await this.messageRepository.save(message);
    return message.toPrimitives();
  }
}

module.exports = ReceiveMessageUseCase;
