import bcrypt
import json
from database import (
    get_filmes, add_filme, update_filme, delete_filme, get_filme_by_id, get_id_by_name,
    add_usuario, get_usuario_by_email, generate_token, verify_token, get_db_connection
)

ultimo_filme_inserido = None

# Handlers existentes, ajustados
def handle_get_filmes(query_params):
    filtros = {}
    if 'titulo' in query_params:
        filtros['titulo'] = query_params['titulo'][0]
    if 'ano' in query_params:
        filtros['ano'] = query_params['ano'][0]
    if 'categoria' in query_params:
        filtros['categoria'] = query_params['categoria'][0]
    filmes = get_filmes(filtros)
    return 200, json.dumps(filmes), 'application/json'

def handle_get_filme_by_id(id):
    filme = get_filme_by_id(id)
    if filme:
        return 200, json.dumps(filme), 'application/json'
    return 404, json.dumps({"error": "Filme não encontrado"}), 'application/json'

def handle_post_login(data):
    usuario = get_usuario_by_email(data['email'])
    if usuario and bcrypt.checkpw(data['senha'].encode(), usuario['password'].encode()):
        token = generate_token(usuario)
        return 200, json.dumps({"token": token, "role": usuario['role']}), 'application/json'
    return 401, json.dumps({"error": "Credenciais inválidas"}), 'application/json'

def require_auth(headers, required_role=None):
    auth_header = headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 401, json.dumps({"error": "Token ausente"}), 'application/json'
    token = auth_header.split(' ')[1]
    payload = verify_token(token)
    if not payload:
        return None, 401, json.dumps({"error": "Token inválido"}), 'application/json'
    if required_role and payload['role'] != required_role:
        return None, 403, json.dumps({"error": "Acesso negado"}), 'application/json'
    return payload, None, None, None

def handle_post_register(data):
    try:
        nome = data['nome']
        email = data['email']
        senha = data['senha']
        role = data.get('role', 'user')
        add_usuario(nome, email, senha, role)
        return 201, json.dumps({"message": "Usuário criado"}), 'application/json'
    except Exception as e:
        return 400, json.dumps({"error": str(e)}), 'application/json'

def handle_post_filme(data, headers):
    payload, status, body, content_type = require_auth(headers)
    if status:
        return status, body, content_type
    required = ['titulo', 'ano', 'produtora', 'genero']
    if not all(key in data for key in required):
        return 400, json.dumps({"error": "Campos obrigatórios"}), 'application/json'
    id_produtora = get_id_by_name('produtora', data['produtora'])
    id_genero = get_id_by_name('genero', data['genero'])
    if not id_produtora or not id_genero:
        return 400, json.dumps({"error": "Produtora ou gênero não encontrado"}), 'application/json'
    status_filme = 'aprovado' if payload['role'] == 'admin' else 'pendente'
    global ultimo_filme_inserido
    ultimo_filme_inserido = add_filme(data['titulo'], data['ano'], id_produtora, id_genero, data.get('sinopse'), data.get('poster'), status_filme, data.get('atores'))
    return 201, json.dumps({"message": "Filme adicionado"}), 'application/json'

def handle_put_filme(id, data, headers):
    payload, status, body, content_type = require_auth(headers)
    if status:
        return status, body, content_type
    update_filme(id, data['titulo'], data['ano'], get_id_by_name('produtora', data['produtora']), get_id_by_name('genero', data['genero']), data.get('sinopse'), data.get('poster'), 'aprovado' if payload['role'] == 'admin' else 'pendente')
    return 200, json.dumps({"message": "Filme atualizado"}), 'application/json'

def handle_delete_filme(id, headers):
    payload, status, body, content_type = require_auth(headers, 'admin')
    if status:
        return status, body, content_type
    delete_filme(id)
    return 200, json.dumps({"message": "Filme deletado"}), 'application/json'

# Novo handler para aprovar filme (painel admin)
def handle_post_approve_movie(data, headers):
    payload, status, body, content_type = require_auth(headers, 'admin')
    if status:
        return status, body, content_type
    movie_id = data.get('movie_id')
    if not movie_id:
        return 400, json.dumps({"error": "movie_id obrigatório"}), 'application/json'
    # Atualizar status
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE filme SET status = 'aprovado' WHERE id = %s AND status = 'pendente'", (movie_id,))
    if cursor.rowcount == 0:
        conn.close()
        return 400, json.dumps({"error": "Filme não encontrado ou já aprovado"}), 'application/json'
    conn.commit()
    conn.close()
    return 200, json.dumps({"message": "Filme aprovado"}), 'application/json'