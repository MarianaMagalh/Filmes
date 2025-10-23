-- Criar banco de dados
CREATE DATABASE filmes_db;
USE filmes_db;

-- Tabela principal: pais
CREATE TABLE pais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela principal: ator
CREATE TABLE ator (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de relacionamento: ator_pais (um ator pode ter múltiplos países, ou vice-versa)
CREATE TABLE ator_pais (
    id_ator INT,
    id_pais INT,
    PRIMARY KEY (id_ator, id_pais),
    FOREIGN KEY (id_ator) REFERENCES ator(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pais) REFERENCES pais(id) ON DELETE CASCADE
);

-- Tabela principal: diretor
CREATE TABLE diretor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de relacionamento: diretor_pais
CREATE TABLE diretor_pais (
    id_diretor INT,
    id_pais INT,
    PRIMARY KEY (id_diretor, id_pais),
    FOREIGN KEY (id_diretor) REFERENCES diretor(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pais) REFERENCES pais(id) ON DELETE CASCADE
);

-- Tabela principal: produtora
CREATE TABLE produtora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de relacionamento: produtora_pais
CREATE TABLE produtora_pais (
    id_produtora INT,
    id_pais INT,
    PRIMARY KEY (id_produtora, id_pais),
    FOREIGN KEY (id_produtora) REFERENCES produtora(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pais) REFERENCES pais(id) ON DELETE CASCADE
);

-- Tabela principal: categoria (ex: ação, drama)
CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela principal: genero (gênero, ex: ficção, documentário)
CREATE TABLE genero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela principal: linguagem
CREATE TABLE linguagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela principal: filme (agora com FK para genero e id_produtora como FK)
CREATE TABLE filme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    id_genero INT,
    id_produtora INT,  -- FK para produtora
    FOREIGN KEY (id_genero) REFERENCES genero(id),
    FOREIGN KEY (id_produtora) REFERENCES produtora(id)
);

-- Tabelas de relacionamento para filme
CREATE TABLE filme_ator (
    id_filme INT,
    id_ator INT,
    PRIMARY KEY (id_filme, id_ator),
    FOREIGN KEY (id_filme) REFERENCES filme(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ator) REFERENCES ator(id) ON DELETE CASCADE
);

CREATE TABLE filme_diretor (
    id_filme INT,
    id_diretor INT,
    PRIMARY KEY (id_filme, id_diretor),
    FOREIGN KEY (id_filme) REFERENCES filme(id) ON DELETE CASCADE,
    FOREIGN KEY (id_diretor) REFERENCES diretor(id) ON DELETE CASCADE
);

CREATE TABLE filme_produtora (
    id_filme INT,
    id_produtora INT,
    PRIMARY KEY (id_filme, id_produtora),
    FOREIGN KEY (id_filme) REFERENCES filme(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produtora) REFERENCES produtora(id) ON DELETE CASCADE
);

CREATE TABLE filme_categoria (
    id_filme INT,
    id_categoria INT,
    PRIMARY KEY (id_filme, id_categoria),
    FOREIGN KEY (id_filme) REFERENCES filme(id) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id) ON DELETE CASCADE
);

CREATE TABLE filme_linguagem (
    id_filme INT,
    id_linguagem INT,
    PRIMARY KEY (id_filme, id_linguagem),
    FOREIGN KEY (id_filme) REFERENCES filme(id) ON DELETE CASCADE,
    FOREIGN KEY (id_linguagem) REFERENCES linguagem(id) ON DELETE CASCADE
);