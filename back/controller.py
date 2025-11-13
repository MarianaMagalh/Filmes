import bcrypt  # Para hash de senhas
import json # para manipular dados JSON (parse e geração de respostas)
from database import (  # Importa funções do banco
    get_filmes, add_filme, update_filme, delete_filme, get_filme_by_id, get_id_by_name,
    add_usuario, get_usuario_by_email, generate_token, verify_token
)


# variavel global para armazenar dados do filme recém-inserido
ultimo_filme_inserido = None


# Handler para GET /filmes (lista com filtros)
def handle_get_filmes(query_params):
    filtros = {}  # Dicionário para filtros
    if 'titulo' in query_params:
        filtros['titulo'] = query_params['titulo'][0]  # Pega valor do query param
    if 'ano' in query_params:
        filtros['ano'] = query_params['ano'][0]
    if 'categoria' in query_params:
        filtros['categoria'] = query_params['categoria'][0]
    filmes = get_filmes(filtros)  # Busca filmes com filtros
    return 200, json.dumps(filmes), 'application/json'


# Handler para GET /filmes/<id> (detalhes de um filme)
def handle_get_filme_by_id(id):
    filme = get_filme_by_id(id)  # Busca filme por ID
    if filme:
        return 200, json.dumps(filme), 'application/json'
    return 404, json.dumps({"error": "Filme não encontrado"}), 'application/json'


# Handler para POST /login (login e geração de JWT)
def handle_post_login(data):
    usuario = get_usuario_by_email(data['email'])  # Busca usuário
    if usuario and bcrypt.checkpw(data['senha'].encode(), usuario['senha'].encode()):  # Verifica senha
        token = generate_token(usuario)  # Gera token
        return 200, json.dumps({"token": token, "role": usuario['role']}), 'application/json'
    return 401, json.dumps({"error": "Credenciais inválidas"}), 'application/json'


# Middleware para verificar JWT e role
def require_auth(headers, required_role=None):
    auth_header = headers.get('Authorization')  # Pega header Authorization
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 401, json.dumps({"error": "Token ausente"}), 'application/json'
    token = auth_header.split(' ')[1]  # Extrai token
    payload = verify_token(token)  # Verifica token
    if not payload:
        return None, 401, json.dumps({"error": "Token inválido"}), 'application/json'
    if required_role and payload['role'] != required_role:  # Verifica role se necessário
        return None, 403, json.dumps({"error": "Acesso negado"}), 'application/json'
    return payload, None, None, None  # Retorna payload se válido


# Handler para POST /register (cadastro de usuário)
def handle_post_register(data):
    try:
        nome = data['nome']
        email = data['email']
        senha = data['senha']
        role = data.get('role', 'user')  # Padrão: user
        add_usuario(nome, email, senha, role)  # Adiciona usuário
        return 201, json.dumps({"message": "Usuário criado"}), 'application/json'
    except Exception as e:
        return 400, json.dumps({"error": str(e)}), 'application/json'


def handle_get_sucesso():
    # controla requisições GET para /sucesso: gera página HTML com dados do filme inserido
    if ultimo_filme_inserido: # verifica se há dados armazenados
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Filme Adicionado com Sucesso</title></head>
        <body>
            <h1>Filme adicionado com sucesso</h1>
            <p><strong>ID:</strong> {ultimo_filme_inserido['id']}</p>
            <p><strong>Título:</strong> {ultimo_filme_inserido['titulo']}</p>
            <p><strong>Ano:</strong> {ultimo_filme_inserido['ano']}</p>
            <a href="/">Voltar</a>
        </body>
        </html>
        """
        return 200, html, 'text/html'
    else:
        return 404, "Nenhum filme adicionado recentemente", 'text/plain'
    
def handle_get_filme_by_id(id): 
    filme = get_filme_by_id(id)
    if filme:
        return 200, json.dumps(filme), 'application/json'
    return 404, json.dumps({"error": "Filme não encontrado"}), 'application/json'
    
# Handler para POST /filmes (adicionar filme, protegido por auth)
def handle_post_filme(data, headers):
    payload, status, body, content_type = require_auth(headers)  # Verifica auth

    if status:
        return status, body, content_type
    # Validações básicas
    required = ['titulo', 'ano', 'produtora', 'categoria']

    if not all(key in data for key in required):
        return 400, json.dumps({"error": "Campos obrigatórios: titulo, ano, produtora, categoria"}), 'application/json'
    if not isinstance(data['ano'], int) or not (1900 <= data['ano'] <= 2100):
        return 400, json.dumps({"error": "Ano deve ser inteiro entre 1900 e 2100"}), 'application/json'
    
    # Converte nomes para IDs
    id_produtora = get_id_by_name('produtora', data['produtora'])
    id_categoria = get_id_by_name('categoria', data['categoria'])
    if not id_produtora or not id_categoria:
        return 400, json.dumps({"error": "Produtora ou categoria não encontrada"}), 'application/json'
    
    # Status baseado no role
    status_filme = 'aprovado' if payload['role'] == 'admin' else 'pendente'
    global ultimo_filme_inserido
    ultimo_filme_inserido = add_filme(data['titulo'], data['ano'], id_produtora, id_categoria, data.get('sinopse'), data.get('poster'), status_filme)
    return 201, json.dumps({"message": "Filme adicionado"}), 'application/json'


# Handler para PUT /filmes/<id> (editar filme, protegido)
def handle_put_filme(id, data, headers):
    payload, status, body, content_type = require_auth(headers)
    if status:
        return status, body, content_type
    # Validações similares ao POST
    update_filme(id, data['titulo'], data['ano'], get_id_by_name('produtora', data['produtora']), 
                 get_id_by_name('categoria', data['categoria']), data.get('sinopse'), data.get('poster'), 
                 'aprovado' if payload['role'] == 'admin' else 'pendente')
    return 200, json.dumps({"message": "Filme atualizado"}), 'application/json'

# Handler para DELETE /filmes/<id> (deletar, só admins)
def handle_delete_filme(id, headers):
    payload, status, body, content_type = require_auth(headers, 'admin')  # Só admins
    if status:
        return status, body, content_type
    delete_filme(id)
    return 200, json.dumps({"message": "Filme deletado"}), 'application/json'