/**
 * Value Object: PhoneNumber
 * Encapsula las reglas de un numero de telefono valido.
 * Al ser un Value Object, es inmutable y se compara por valor, no por referencia.
 */
class PhoneNumber {
  constructor(value) {
    const cleaned = String(value).replace(/[^\d+]/g, "");

    if (!/^\+?\d{8,15}$/.test(cleaned)) {
      throw new Error(`Numero de telefono invalido: ${value}`);
    }

    this._value = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
    Object.freeze(this);
  }

  get value() {
    return this._value;
  }

  /** Formato requerido por whatsapp-web.js: numero + "@c.us" */
  toWhatsAppId() {
    return `${this._value.replace("+", "")}@c.us`;
  }

  equals(other) {
    return other instanceof PhoneNumber && other.value === this._value;
  }

  toString() {
    return this._value;
  }
}

module.exports = PhoneNumber;
