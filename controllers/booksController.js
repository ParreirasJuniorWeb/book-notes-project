import db from "../database/conn.js";

export const getAllBooks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao listar livros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    
    const result = await db.query(
      `INSERT INTO books (title, image, recommendation_note, reading_dt, recommendation_text, isbn, summary, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        bookData.title,
        bookData.image,
        bookData.recommendation_note,
        bookData.reading_dt,
        bookData.recommendation_text,
        bookData.isbn,
        bookData.summary,
        bookData.author_id
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const result = await db.query(
      `UPDATE books SET 
       title = $1, image = $2, recommendation_note = $3, reading_dt = $4, 
       recommendation_text = $5, isbn = $6, summary = $7, author_id = $8 
       WHERE id = $9 RETURNING *`,
      [
        bookData.title, bookData.image, bookData.recommendation_note,
        bookData.reading_dt, bookData.recommendation_text, bookData.isbn,
        bookData.summary, bookData.author_id, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }
    
    res.status(200).json({ message: "Livro deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};