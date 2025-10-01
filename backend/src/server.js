import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const __dirname = path.resolve();

const app = express();


const PORT = ENV.PORT || 3000;


app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);





//make ready for deployment

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

  


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`)
            
        });

    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    });