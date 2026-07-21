import axios from "axios";

export class WhatsAppCloudAdapter {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseUrl = `https://graph.facebook.com/v23.0/${this.phoneNumberId}`;
  }

  async sendTextMessage(to, body) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: {
            body
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error enviando mensaje:", error.response?.data || error.message);
      throw error;
    }
  }

  async sendTemplate(to, templateName, language = "es") {
    return axios.post(
      `${this.baseUrl}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: language
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      }
    );
  }
}