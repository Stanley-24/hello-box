import express from 'express';

const router = express.Router();

router.get("/get-messages", (req, res) => {
  res.send({ message: "Get Messages endpoint" });
});

router.post("/send-message", (req, res) => {
  res.send({ message: "Send Message endpoint" });
});


export default router;