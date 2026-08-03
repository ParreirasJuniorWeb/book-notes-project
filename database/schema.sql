CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    recommendation_note INT CHECK (recommendation_note BETWEEN 1 AND 5),
    reading_dt DATE,
    recommendation_text TEXT,
    isbn VARCHAR(20) UNIQUE,
    summary TEXT,
    author_id INT NOT NULL,
    
    -- Foreign Key relacionando o livro ao autor
    CONSTRAINT fk_books_authors 
        FOREIGN KEY (author_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Índice para otimizar buscas por autor
CREATE INDEX idx_books_author_id ON books(author_id);