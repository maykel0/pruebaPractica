const PhoneNumber = require("../../domain/value-objects/PhoneNumber");

class GetConversationUseCase {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute({ me, contact }) {
    const meNumber = new PhoneNumber(me);
    const contactNumber = new PhoneNumber(contact);

    const messages = await this.messageRepository.findByConversation(
      meNumber,
      contactNumber
    );

    return messages.map((m) => m.toPrimitives());
  }
}

module.exports = GetConversationUseCase;
