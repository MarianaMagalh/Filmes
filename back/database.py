import mysql.connector  # Para conectar ao MySQL
import bcrypt  # Para hash de senhas
import jwt  # Para JWT
import os  # Para chave secreta JWT

# Configuração do banco (ajuste credenciais)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'filmes_db'
}

# Chave secreta para JWT (use variável de ambiente em produção)
SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')

def get_db_connection():
    """Conecta ao banco MySQL."""
    return mysql.connector.connect(**DB_CONFIG)

def get_filmes(filtros=None):
    """Busca filmes com filtros opcionais (titulo, ano, categoria). Retorna lista de dicionários."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT f.id, f.titulo, f.ano, f.sinopse, f.poster, f.status,
               g.nome AS genero, p.nome AS produtora
        FROM filme f
        LEFT JOIN genero g ON f.id_genero = g.id
        LEFT JOIN produtora p ON f.id_produtora = p.id
        WHERE 1=1
    """
    params = []
    if filtros:
        if 'titulo' in filtros:
            query += " AND f.titulo LIKE %s"
            params.append(f"%{filtros['titulo']}%")
        if 'ano' in filtros:
            query += " AND f.ano = %s"
            params.append(filtros['ano'])
        if 'categoria' in filtros:
            query += " AND f.id IN (SELECT id_filme FROM filme_categoria fc JOIN categoria c ON fc.id_categoria = c.id WHERE c.nome = %s)"
            params.append(filtros['categoria'])
    cursor.execute(query, params)
    filmes = cursor.fetchall()
    conn.close()
    return filmes

def get_filme_by_id(filme_id):
    """Busca filme por ID, incluindo relacionamentos (atores, diretores, etc.)."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT f.*, 
               g.nome AS genero, 
               p.nome AS produtora
        FROM filme f
        LEFT JOIN genero g ON f.id_genero = g.id
        LEFT JOIN produtora p ON f.id_produtora = p.id
        WHERE f.id = %s
    """
    cursor.execute(query, (filme_id,))
    filme = cursor.fetchone()
    
    if not filme:
        conn.close()
        return None
    
    cursor.execute("SELECT a.nome FROM ator a JOIN filme_ator fa ON a.id = fa.id_ator WHERE fa.id_filme = %s", (filme_id,))
    filme['atores'] = [row['nome'] for row in cursor.fetchall()]

    conn.close()
    return filme

def add_filme(titulo, ano, id_produtora, id_genero, sinopse, poster, status, atores=None, diretores=None, categorias=None):
    """Adiciona filme e relacionamentos. Retorna dados do filme inserido."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO filme (titulo, ano, sinopse, poster, id_genero, id_produtora, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                   (titulo, ano, sinopse, poster, id_genero, id_produtora, status))
    filme_id = cursor.lastrowid
    # Inserir relacionamentos (ex.: atores)
    if atores:
        for ator_nome in atores:
            cursor.execute("INSERT IGNORE INTO ator (nome) VALUES (%s)", (ator_nome,))  # IGNORE se já existe
            cursor.execute("SELECT id FROM ator WHERE nome = %s", (ator_nome,))
            ator_id = cursor.fetchone()[0]
            cursor.execute("INSERT INTO filme_ator (id_filme, id_ator) VALUES (%s, %s)", (filme_id, ator_id))
    # Similar para diretores e categorias (implemente se necessário)
    conn.commit()
    conn.close()
    return {"id": filme_id, "titulo": titulo, "ano": ano}

def update_filme(filme_id, titulo, ano, id_produtora, id_genero, sinopse, poster, status):
    """Atualiza filme."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE filme SET titulo=%s, ano=%s, sinopse=%s, poster=%s, id_genero=%s, id_produtora=%s, status=%s WHERE id=%s",
                   (titulo, ano, sinopse, poster, id_genero, id_produtora, status, filme_id))
    conn.commit()
    conn.close()

def delete_filme(filme_id):
    """Deleta filme (relacionamentos são deletados automaticamente por CASCADE)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM filme WHERE id = %s", (filme_id,))
    conn.commit()
    conn.close()

def get_id_by_name(table, name):
    """Busca ID por nome em tabelas como produtora, categoria, etc."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT id FROM {table} WHERE nome = %s", (name,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None

def add_usuario(nome, email, senha, role):
    """Adiciona usuário com senha hashed."""
    hashed = bcrypt.hashpw(senha.encode(), bcrypt.gensalt())
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuario (nome, email, password, role) VALUES (%s, %s, %s, %s)", (nome, email, hashed.decode(), role))
    conn.commit()
    conn.close()

def get_usuario_by_email(email):
    """Busca usuário por email."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def generate_token(user):
    """Gera JWT para usuário."""
    payload = {"id": user['id'], "role": user['role']}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verifica JWT e retorna payload."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None

def get_or_create_id(table, name):
    """
    Busca o ID de um registro pelo nome. 
    Se não existir, CRIA o registro e retorna o novo ID.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Tenta buscar o ID existente
    cursor.execute(f"SELECT id FROM {table} WHERE nome = %s", (name,))
    result = cursor.fetchone()
    
    if result:
        conn.close()
        return result[0] # Retorna o ID encontrado
    
    # 2. Se não achou, CRIA um novo
    try:
        cursor.execute(f"INSERT INTO {table} (nome) VALUES (%s)", (name,))
        conn.commit()
        new_id = cursor.lastrowid # Pega o ID que acabou de ser criado
        conn.close()
        return new_id
    except Exception as e:
        print(f"Erro ao criar em {table}: {e}")
        conn.close()
        return None