let me = "";
let contact = "";
let pollTimer = null;

const $messages = document.getElementById("messages");
const $sendForm = document.getElementById("sendForm");
const $text = document.getElementById("text");
const $qrBox = document.getElementById("qrBox");
const $qrImage = document.getElementById("qrImage");

document.getElementById("loadChat").addEventListener("click", async () => {
  me = document.getElementById("me").value.trim();
  contact = document.getElementById("contact").value.trim();
  if (!me || !contact) return alert("Completa ambos numeros");

  await refreshMessages();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(refreshMessages, 2000);
});

$sendForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = $text.value.trim();
  if (!text || !me || !contact) return;

  try {
    await Api.sendMessage({ from: me, to: contact, text });
    $text.value = "";
    await refreshMessages();
  } catch (err) {
    alert(err.message);
  }
});

async function refreshMessages() {
  try {
    const messages = await Api.getConversation({ me, contact });
    renderMessages(messages);
  } catch (err) {
    console.error(err);
  }
}

function renderMessages(messages) {
  $messages.innerHTML = "";
  for (const m of messages) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${m.direction}`;
    bubble.textContent = m.content;
    $messages.appendChild(bubble);
  }
  $messages.scrollTop = $messages.scrollHeight;
}

// Si el backend esta usando el adaptador real de WhatsApp, muestra el QR.
async function pollQr() {
  const data = await Api.getQr();
  if (data && data.qr) {
    $qrImage.src = data.qr;
    $qrBox.classList.remove("hidden");
  } else {
    setTimeout(pollQr, 2000);
  }
}
pollQr();
