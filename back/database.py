# arquivo sobre o banco de dados

import mysql.connector
import bcrypt  # Para hash de senhas
import jwt  # Para gerar e verificar JWT
import datetime  # Para definir expiração do token

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


def get_filmes(filtros = None):
    # retorna uma lista de dicionários com informações completas de cada filme
    
    conn = get_connection() # cria conexão com o banco
    cursor = conn.cursor(dictionary=True) # retorna resultados como dicionários
    query = """
        SELECT 
            f.id, f.titulo, f.ano, f.sinopse, f.poster,  # Adicione sinopse, poster se existir
            c.nome AS categoria, p.nome AS produtora
        FROM filme f
        LEFT JOIN categoria c ON f.id_categoria = c.id
        LEFT JOIN produtora p ON f.id_produtora = p.id
    """
    
    params = []
    if filtros:
        conditions = []
        if 'titulo' in filtros:
            conditions.append("f.titulo LIKE %s")
            params.append(f"%{filtros['titulo']}%")
        if 'ano' in filtros:
            conditions.append("f.ano = %s")
            params.append(filtros['ano'])
        if 'categoria' in filtros:
            conditions.append("c.nome = %s")
            params.append(filtros['categoria'])
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
    cursor.execute(query, params)
    result = cursor.fetchall()
    conn.close()
    return result


# Função para buscar um filme específico por ID
def get_filme_by_id(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.*, c.nome AS categoria, p.nome AS produtora
        FROM filme f
        LEFT JOIN categoria c ON f.id_categoria = c.id
        LEFT JOIN produtora p ON f.id_produtora = p.id
        WHERE f.id = %s
    """, (id,))  # Busca filme por ID
    result = cursor.fetchone()  # Retorna um único resultado
    conn.close()
    return result  # Retorna dicionário do filme ou None


def add_filme(titulo, ano, id_categoria, id_produtora, atores=None, diretores=None, categorias=None, linguagens=None, sinopse=None, poster=None):
    # Insere filme e relacionamentos
    # recebe dados básicos de filme e listas opcionais de IDs para relacionamentos
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO filme (titulo, ano, id_produtora, id_categoria, sinopse, poster) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (titulo, ano, id_produtora, id_categoria, sinopse, poster))
    filme_id = cursor.lastrowid# guarda o id do filme recém-inserido
    
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


def update_filme(id, titulo, ano, id_produtora, id_categoria, atores=None, diretores=None, categorias=None, linguagens=None, sinopse=None, poster=None):
    # Função para atualizar um filme existente pelo ID
    # Limpando relacionamentos antigos e reinsere novos para simplicidade
    conn = get_connection()
    cursor = conn.cursor()
    
    # atualiza os campos principais do filme
    cursor.execute("UPDATE filme SET titulo=%s, ano=%s, id_produtora=%s, id_categoria=%s, sinopse=%s, poster=%s WHERE id=%s", 
                   (titulo, ano, id_produtora, id_categoria, sinopse, poster, id))
    
    # limpa e reinsere relacionamentos
    cursor.execute("DELETE FROM filme_ator WHERE id_filme=%s", (id,))
    cursor.execute("DELETE FROM filme_diretor WHERE id_filme=%s", (id,))

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

    
def get_id_by_name(id):
    # Função para buscar o ID de uma entidade pelo nome
    # converte nomes em ids durante validações/inserções
    conn = get_connection()
    cursor = conn.cursor
    cursor.execute("""
        SELECT f.*, c.nome AS categoria, p.nome AS produtora
        FROM filme f
        LEFT JOIN categoria c ON f.id_categoria = c.id
        LEFT JOIN produtora p ON f.id_produtora = p.id
        WHERE f.id = %s
    """, (id,))
    result = cursor.fetchone() # busca um resultado
    if result:
        pass
    conn.close()
    return result


# Função para buscar ID de uma entidade (ex.: produtora, categoria) pelo nome
def get_id_by_name(table, name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT id FROM {table} WHERE nome = %s", (name,))  # Query dinâmica por tabela
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None  # Retorna ID ou None
# Funções para usuários (autenticação)
SECRET_KEY = 'sua_chave_secreta_aqui'  # Chave secreta para JWT (mude para produção)


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


 # Adiciona um usuário
def add_usuario(nome, email, senha, role='user'):
    hashed = bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()  # Hash da senha
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuario (nome, email, senha, role) VALUES (%s, %s, %s, %s)", (nome, email, hashed, role))
    usuario_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return usuario_id

# Busca usuário por email
def get_usuario_by_email(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario WHERE email = %s", (email,))
    result = cursor.fetchone()
    conn.close()
    return result

# Gera JWT para usuário
def generate_token(usuario):
    payload = {
        'id': usuario['id'],  # ID do usuário
        'role': usuario['role'],  # Role (user ou admin)
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expira em 1 hora
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')  # Codifica o token

# Verifica JWT
def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])  # Decodifica e valida
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None  # Retorna None se inválido