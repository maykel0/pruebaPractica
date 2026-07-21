const MessagingGatewayPort = require("../../../domain/services/MessagingGatewayPort");

/**
 * Adaptador: MockMessagingAdapter
 *
 * Implementa el mismo contrato (MessagingGatewayPort) que el adaptador real
 * de WhatsApp, pero solo simula el envio en memoria/consola. Sirve para:
 *  - Desarrollar y probar la app sin depender de whatsapp-web.js ni de un QR
 *  - Probar la arquitectura Hexagonal: puedes cambiar este adaptador por el
 *    real (WhatsAppWebAdapter) sin tocar los casos de uso ni el dominio.
 */
class MockMessagingAdapter extends MessagingGatewayPort {
  constructor() {
    super();
    this._handler = null;
  }

  async initialize() {
    console.log("[MockMessagingAdapter] listo (no requiere WhatsApp real)");
  }

  async sendMessage(to, content) {
    console.log(`[MockMessagingAdapter] -> enviando a ${to} : "${content}"`);
    return { externalId: `mock-${Date.now()}` };
  }

  onMessageReceived(handler) {
    this._handler = handler;
  }

  /** Util solo para pruebas manuales: simula que llega un mensaje */
  simulateIncoming({ from, to, text }) {
    if (this._handler) this._handler({ from, to, text });
  }
}

module.exports = MockMessagingAdapter;
