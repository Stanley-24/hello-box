import express from 'express';

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send({ message: "Signup endpoint" });
});

router.get("/login", (req, res) => {
  res.send({ message: "Login endpoint" });
});

router.get("/logout", (req, res) => {
  res.send({ message: "Logout endpoint" });
});



export default router;