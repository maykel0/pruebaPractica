/**
 * Puerto (interfaz): MessagingGatewayPort
 *
 * Cualquier forma de "enviar mensajes" (WhatsApp real via whatsapp-web.js,
 * un mock en memoria, o en el futuro la API oficial de Meta) debe cumplir
 * este contrato. Gracias a esto el caso de uso SendMessageUseCase nunca
 * cambia aunque cambiemos el adaptador (Principio Abierto/Cerrado).
 */
class MessagingGatewayPort {
  /**
   * @param {PhoneNumber} to
   * @param {MessageContent} content
   * @returns {Promise<{ externalId: string }>}
   */
  async sendMessage(_to, _content) {
    throw new Error("MessagingGatewayPort.sendMessage() no implementado");
  }

  /**
   * Registra un callback que se dispara cuando llega un mensaje entrante.
   * @param {(payload: { from: string, text: string }) => void} handler
   */
  onMessageReceived(_handler) {
    throw new Error("MessagingGatewayPort.onMessageReceived() no implementado");
  }

  async initialize() {
    throw new Error("MessagingGatewayPort.initialize() no implementado");
  }
}

module.exports = MessagingGatewayPort;
