import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

// ========== EXPRESS CONFIGURATION ========== //
const app = express();
app.use(cors());
app.use(express.json());
routes(app);

export default app;
