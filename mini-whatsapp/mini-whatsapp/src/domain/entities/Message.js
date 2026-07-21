const { randomUUID } = require("crypto");

/**
 * Entidad de dominio: Message
 * Tiene identidad propia (id) y un ciclo de vida, a diferencia de un Value Object.
 */
class Message {
  constructor({ id, from, to, content, direction, timestamp, status }) {
    this.id = id || randomUUID();
    this.from = from; // PhoneNumber
    this.to = to; // PhoneNumber
    this.content = content; // MessageContent
    this.direction = direction; // "outgoing" | "incoming"
    this.timestamp = timestamp || new Date();
    this.status = status || "pending"; // pending | sent | delivered | failed
  }

  markAsSent() {
    this.status = "sent";
  }

  markAsFailed() {
    this.status = "failed";
  }

  toPrimitives() {
    return {
      id: this.id,
      from: this.from.toString(),
      to: this.to.toString(),
      content: this.content.toString(),
      direction: this.direction,
      timestamp: this.timestamp,
      status: this.status,
    };
  }
}

module.exports = Message;
