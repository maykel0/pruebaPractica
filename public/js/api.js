const Api = {
  async sendMessage({ from, to, text }) {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, text }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getConversation({ me, contact }) {
    const params = new URLSearchParams({ me, contact });
    const res = await fetch(`/api/messages?${params}`);
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getQr() {
    const res = await fetch("/api/qr");
    if (!res.ok) return null;
    return res.json();
  },
};
