# arquivo sobre o banco de dados
import mysql.connector

# Configuração do banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'senai',
    'database': 'filmes_db'
}

# Funçaõ que cria e retora uma conexão com o banco
def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


def get_filmes():
    # retorna uma lista de dicionários com informações completas de cada filme
    
    conn = get_connection() # cria conexão com o banco
    cursor = conn.cursor(dictionary=True) # retorna resultados como dicionários
    
    # JOIN para buscar dados relacionados
    cursor.execute("""
                    SELECT 
                        f.id, 
                        f.titulo, 
                        f.ano, 
                        c.nome AS categoria, 
                        p.nome AS produtora
                    FROM filme f
                    LEFT JOIN categoria c ON f.id_categoria = c.id
                    LEFT JOIN produtora p ON f.id_produtora = p.id
                   """)
    result = cursor.fetchall() # busca todos os resultados da consulta
    conn.close() # fecha a conexão para liberar recursos e evitar vazamentos
    return result # retorna a lista de filmes com dados relacionados


def add_filme(titulo, ano, id_categoria, id_produtora, atores=None, diretores=None, categorias=None, linguagens=None):
    # Insere filme e relacionamentos
    # recebe dados básicos de filme e listas opcionais de IDs para relacionamentos
    conn = get_connection()
    cursor = conn.cursor() # executa comandos SQL
    
    # Insere o filme na tabela principal, obtendo o ID
    cursor.execute("INSERT INTO filme (titulo, ano, id_genero, id_produtora) VALUES (%s, %s, %s, %s)", (titulo, ano, id_categoria, id_produtora))
    filme_id = cursor.lastrowid # guarda o id do filme recém-inserido
    
    # Insere relacionamentos muitos-para-muitos 
    if atores:
        for ator_id in atores:
            cursor.execute("INSERT INTO filmes_ator (id_filme, id_ator) VALUES (%s, %s)", (filme_id, ator_id))
    if diretores:
        for diretor_id in diretores:
            cursor.execute("INSERT INTO filme_diretor (id_filme, id_diretor) VALUES (%s, %s)", (filme_id, diretor_id))
    if categorias:
        for cate_id in categorias:
            cursor.execute("INSERT INTO filme_categoria (id_filme, id_categoria) VALUES (%s, %s)", (filme_id, cate_id))
    if linguagens:
        for lang_id in linguagens:
            cursor.execute("INSERT INTO filme_linguagem (id_filme, id_linguagem) VALUES (%s, %s)", (filme_id, lang_id))

    conn.commit() # confirma todas as transações
    conn.close()
    return {"id": filme_id, "titulo": titulo, "ano": ano} # Retorna dados básicosdo filme


def update_filme(id, titulo, ano, id_produtora, id_categoria, atores=None, diretores=None, categorias=None, linguagens=None):
    # Função para atualizar um filme existente pelo ID
    # Limpando relacionamentos antigos e reinsere novos para simplicidade
    conn = get_connection()
    cursor = conn.cursor()
    
    # atualiza os campos principais do filme
    cursor.execute("UPDATE filme SET titulo=%s, ano=%s, id_produtura=%s, id_categoria=%s WHERE id=%s", (titulo, ano, id_produtora, id_categoria, id))
    
    # limpa e reinsere relacionamentos
    cursor.execute("DELETE FROM filme_ator (id_filme, id_ator) VALUES (%s, %s)", (id))
    
    if atores:
        for ator_id in atores:
            cursor.execute("INERT INTO filme_ator (id_filme, id_ator) VALUES (%s, %s)", (id, ator_id))
    
    conn.commit() #confirma mudanças
    conn.close() # fecha conexão
    
    
def delete_filme(id):
    # Função para excluir um filme pelo ID
    # Os relacionamentos são deletados automaticamente devido ao CASCADE nas FKs
    conn = get_connection()  # Abre conexão
    cursor = conn.cursor()  # Cria cursor
    cursor.execute("DELETE FROM filme WHERE id=%s", (id,))  # Deleta o filme
    conn.commit()  # Confirma
    conn.close()  # Fecha

    
def get_id_by_name(table, name):
    # Função para buscar o ID de uma entidade pelo nome
    # converte nomes em ids durante validações/inserções
    conn = get_connection()
    cursor = conn.cursor
    cursor.execute(f"SELECT id FROM {table} WHERE nome = %s", (name,))
    result = cursor.fetchone() # busca um resultado
    conn.close()
    return result[0] if result else None # retorna id se encontrado

# funções para inserir atores/diretores com gênero
def add_ator(nome, id_genero):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO ator (nome, id_genero) VALUES (%s, %s)", (nome, id_genero))
    ator_id = cursor.lastrowid # guarda o id gerado
    conn.commit()
    conn.close()
    return ator_id # retorna id para uso

def add_director(nome, id_genero):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO diretor (nome, id_genero) VALUES (%s, %s)", (nome, id_genero))
    diretor_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return diretor_id