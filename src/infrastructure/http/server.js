require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const buildContainer = require("../config/container");
const MessageController = require("./controllers/MessageController");
const messageRoutes = require("./routes/messageRoutes");

const PORT = process.env.PORT || 3000;

let lastQrImage = null;

const container = buildContainer({
  onQrCode: (qrImage) => {
    lastQrImage = qrImage;
  },
});

const {
  messagingGateway,
  receiveMessageUseCase,
  sendMessageUseCase,
  getConversationUseCase,
} = container;

// Cuando llega un mensaje entrante (WhatsApp real o simulado), lo guardamos.
messagingGateway.onMessageReceived(async ({ from, to, text }) => {
  try {
    await receiveMessageUseCase.execute({
      from,
      to: to || process.env.MY_NUMBER || from,
      text,
    });
    console.log(`[server] mensaje entrante guardado de ${from}`);
  } catch (err) {
    console.error("[server] error guardando mensaje entrante:", err.message);
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../../public")));

const messageController = new MessageController({
  sendMessageUseCase,
  getConversationUseCase,
});

app.use("/api", messageRoutes(messageController));

// Solo util con MESSAGING_ADAPTER=whatsapp: para mostrar el QR en el navegador
app.get("/api/qr", (req, res) => {
  if (!lastQrImage) return res.status(404).json({ error: "QR no disponible aun" });
  res.json({ qr: lastQrImage });
});

// Solo util con MESSAGING_ADAPTER=mock: para simular que un companero te escribe
app.post("/api/simulate-incoming", (req, res) => {
  const { from, to, text } = req.body;
  if (typeof messagingGateway.simulateIncoming !== "function") {
    return res.status(400).json({ error: "Solo disponible con el adaptador mock" });
  }
  messagingGateway.simulateIncoming({ from, to, text });
  res.status(202).json({ ok: true });
});

async function start() {
  await messagingGateway.initialize();
  app.listen(PORT, () => {
    console.log(`Mini WhatsApp corriendo en http://localhost:${PORT}`);
    console.log(`Adaptador de mensajeria: ${process.env.MESSAGING_ADAPTER || "mock"}`);
  });
}

start();
