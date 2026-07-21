const InMemoryMessageRepository = require("../adapters/repositories/InMemoryMessageRepository");
const MockMessagingAdapter = require("../adapters/messaging/MockMessagingAdapter");
// WhatsAppWebAdapter se carga solo si hace falta (requiere whatsapp-web.js
// instalado); asi el modo "mock" funciona aunque esa dependencia no este
// instalada todavia.

const SendMessageUseCase = require("../../application/use-cases/SendMessageUseCase");
const ReceiveMessageUseCase = require("../../application/use-cases/ReceiveMessageUseCase");
const GetConversationUseCase = require("../../application/use-cases/GetConversationUseCase");

/**
 * Composition Root
 *
 * Este es el UNICO lugar del proyecto donde se elige la implementacion
 * concreta de cada puerto. Todo lo demas (dominio y aplicacion) solo
 * conoce las interfaces. Cambiar MESSAGING_ADAPTER en el .env es
 * suficiente para pasar de "mock" a "whatsapp" real sin tocar codigo.
 */
function buildContainer({ onQrCode } = {}) {
  const messageRepository = new InMemoryMessageRepository();

  let messagingGateway;
  if (process.env.MESSAGING_ADAPTER === "whatsapp") {
    const WhatsAppWebAdapter = require("../adapters/messaging/WhatsAppWebAdapter");
    messagingGateway = new WhatsAppWebAdapter({ onQrCode });
  } else {
    messagingGateway = new MockMessagingAdapter();
  }

  const sendMessageUseCase = new SendMessageUseCase(
    messageRepository,
    messagingGateway
  );
  const receiveMessageUseCase = new ReceiveMessageUseCase(messageRepository);
  const getConversationUseCase = new GetConversationUseCase(messageRepository);

  return {
    messageRepository,
    messagingGateway,
    sendMessageUseCase,
    receiveMessageUseCase,
    getConversationUseCase,
  };
}

module.exports = buildContainer;
