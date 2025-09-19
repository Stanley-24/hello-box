import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
