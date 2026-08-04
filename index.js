import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT_BACKEND || 4000;

app.listen(port, () => {
  console.log(`🚀 API rodando em http://localhost:${port}`);
});
