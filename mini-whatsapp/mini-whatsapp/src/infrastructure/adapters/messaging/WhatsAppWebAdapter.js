const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const MessagingGatewayPort = require("../../../domain/services/MessagingGatewayPort");

/**
 * Adaptador: WhatsAppWebAdapter
 *
 * Implementa MessagingGatewayPort usando whatsapp-web.js, que automatiza
 * una sesion de WhatsApp Web. No necesita token ni cuenta de negocio de
 * Meta: solo escaneas un QR con tu WhatsApp normal (como cuando vinculas
 * un dispositivo). Ideal para este proyecto de clase porque tus companeros
 * pueden probarlo con su propio numero sin pedir credenciales a nadie.
 *
 * IMPORTANTE: es una libreria NO oficial. Sirve perfecto para un proyecto
 * academico, pero no la uses para produccion real de una empresa.
 */
class WhatsAppWebAdapter extends MessagingGatewayPort {
  constructor({ onQrCode } = {}) {
    super();
    this._handler = null;
    this._onQrCode = onQrCode || ((qr) => console.log("QR recibido:", qr));
    this._client = new Client({
      authStrategy: new LocalAuth({ dataPath: ".wwebjs_auth" }),
      puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
    });
  }

  async initialize() {
    this._client.on("qr", async (qr) => {
      const qrImage = await qrcode.toDataURL(qr);
      this._onQrCode(qrImage);
      console.log("Escanea el QR con WhatsApp (Dispositivos vinculados)");
    });

    this._client.on("ready", () => {
      console.log("[WhatsAppWebAdapter] Conectado a WhatsApp");
    });

    this._client.on("message", (msg) => {
      if (this._handler) {
        this._handler({ from: msg.from.replace("@c.us", ""), text: msg.body });
      }
    });

    await this._client.initialize();
  }

  async sendMessage(to, content) {
    const chatId = to.toWhatsAppId();
    const sent = await this._client.sendMessage(chatId, content.toString());
    return { externalId: sent.id?.id || `wa-${Date.now()}` };
  }

  onMessageReceived(handler) {
    this._handler = handler;
  }
}

module.exports = WhatsAppWebAdapter;
