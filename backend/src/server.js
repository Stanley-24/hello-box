import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import path from 'path';

const app = express();

const PORT = ENV.PORT || 3000;
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);





//make ready for deployment

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
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