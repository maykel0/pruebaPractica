/**
 * Value Object: MessageContent
 * Encapsula las reglas de negocio sobre el contenido de un mensaje.
 */
class MessageContent {
  static MAX_LENGTH = 4096;

  constructor(text) {
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("El contenido del mensaje no puede estar vacio");
    }
    if (text.length > MessageContent.MAX_LENGTH) {
      throw new Error(
        `El mensaje supera el maximo de ${MessageContent.MAX_LENGTH} caracteres`
      );
    }

    this._value = text.trim();
    Object.freeze(this);
  }

  get value() {
    return this._value;
  }

  toString() {
    return this._value;
  }
}

module.exports = MessageContent;
