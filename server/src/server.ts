const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';  // ✅ Import CORS
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Enable CORS for frontend requests
app.use((req, _, next) => {
  console.log("🛠 CORS Request from:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // ✅ Allow both ports
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

app.use(express.json());
app.use(routes);

sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});