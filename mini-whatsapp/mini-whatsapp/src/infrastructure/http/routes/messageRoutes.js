const { Router } = require("express");

function messageRoutes(messageController) {
  const router = Router();

  router.post("/messages", messageController.send);
  router.get("/messages", messageController.getConversation);

  return router;
}

module.exports = messageRoutes;
