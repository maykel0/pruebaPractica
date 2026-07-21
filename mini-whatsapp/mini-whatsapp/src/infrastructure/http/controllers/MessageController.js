/**
 * Controller: solo traduce HTTP <-> casos de uso.
 * No contiene reglas de negocio (esas viven en application/ y domain/).
 */
class MessageController {
  constructor({ sendMessageUseCase, getConversationUseCase }) {
    this.sendMessageUseCase = sendMessageUseCase;
    this.getConversationUseCase = getConversationUseCase;
  }

  send = async (req, res) => {
    try {
      const { from, to, text } = req.body;
      const message = await this.sendMessageUseCase.execute({ from, to, text });
      res.status(201).json(message);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  getConversation = async (req, res) => {
    try {
      const { me, contact } = req.query;
      const messages = await this.getConversationUseCase.execute({ me, contact });
      res.json(messages);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

module.exports = MessageController;
