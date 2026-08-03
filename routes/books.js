import express from "express";
import * as bookController from "../controllers/booksController.js";
import authGuard from "../middlewares/authGuard.js";

const router = express.Router();

router.use(authGuard); // Todas as rotas de livros precisam de autenticação

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook); // Use PUT para update
router.delete("/:id", bookController.deleteBook); // DELETE para exclusão

export default router;