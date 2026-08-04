import db from "../database/conn.js";

const parseRecommendationNote = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const note = Number(value);

  if (!Number.isInteger(note) || note < 1 || note > 5) {
    return {
      error: "recommendation_note inválido: use um inteiro entre 1 e 5",
    };
  }

  return { value: note };
};

const mapDatabaseError = (error) => {
  if (error?.code === "23505") {
    return {
      status: 409,
      error: "Registro duplicado (ex.: ISBN já cadastrado)",
    };
  }

  if (error?.code === "23503") {
    return {
      status: 400,
      error: "Referência inválida (ex.: author_id inexistente)",
    };
  }

  if (error?.code === "23514") {
    return {
      status: 400,
      error: "Violação de regra de validação do banco de dados",
    };
  }

  return null;
};

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
    const bookData = req.body || {};

    const title =
      typeof bookData.title === "string" ? bookData.title.trim() : "";
    const recommendationText =
      typeof bookData.recommendation_text === "string"
        ? bookData.recommendation_text.trim()
        : "";
    const authorId = Number(bookData.author_id);
    const recommendationNoteParsed = parseRecommendationNote(
      bookData.recommendation_note,
    );

    if (!title) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    if (!recommendationText) {
      return res.status(400).json({ error: "Recomendação é obrigatória" });
    }

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({ error: "author_id inválido" });
    }

    if (recommendationNoteParsed?.error) {
      return res.status(400).json({ error: recommendationNoteParsed.error });
    }

    const result = await db.query(
      `INSERT INTO books (title, image, recommendation_note, reading_dt, recommendation_text, isbn, summary, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        title,
        bookData.image || null,
        recommendationNoteParsed?.value ?? null,
        bookData.reading_dt || null,
        recommendationText,
        bookData.isbn || null,
        bookData.summary || null,
        authorId,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    const mappedError = mapDatabaseError(error);

    if (mappedError) {
      return res.status(mappedError.status).json({ error: mappedError.error });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body || {};

    const title =
      typeof bookData.title === "string" ? bookData.title.trim() : "";
    const recommendationText =
      typeof bookData.recommendation_text === "string"
        ? bookData.recommendation_text.trim()
        : "";
    const authorId = Number(bookData.author_id);
    const recommendationNoteParsed = parseRecommendationNote(
      bookData.recommendation_note,
    );

    if (!title) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    if (!recommendationText) {
      return res.status(400).json({ error: "Recomendação é obrigatória" });
    }

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({ error: "author_id inválido" });
    }

    if (recommendationNoteParsed?.error) {
      return res.status(400).json({ error: recommendationNoteParsed.error });
    }

    const result = await db.query(
      `UPDATE books SET 
       title = $1, image = $2, recommendation_note = $3, reading_dt = $4, 
       recommendation_text = $5, isbn = $6, summary = $7, author_id = $8 
       WHERE id = $9 RETURNING *`,
      [
        title,
        bookData.image || null,
        recommendationNoteParsed?.value ?? null,
        bookData.reading_dt || null,
        recommendationText,
        bookData.isbn || null,
        bookData.summary || null,
        authorId,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    const mappedError = mapDatabaseError(error);

    if (mappedError) {
      return res.status(mappedError.status).json({ error: mappedError.error });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );

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
  deleteBook,
};
