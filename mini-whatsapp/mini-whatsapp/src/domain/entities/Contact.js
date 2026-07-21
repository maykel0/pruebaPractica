class Contact {
  constructor({ id, name, phoneNumber }) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber; // PhoneNumber
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber.toString(),
    };
  }
}

module.exports = Contact;
