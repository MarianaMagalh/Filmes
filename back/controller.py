import json # para manipular dados JSON (parse e geração de respostas)
from database import get_filmes, add_filme, update_filme, delete_filme, get_id_by_name

# variavel global para armazenar dados do filme recém-inserido
ultimo_filme_inserido = None

def handle_get_filmes():
    # Controla requisições GET para /filmes: busca e retorna lista de filmes em JSON
    filmes = get_filmes()
    return 200, json.dumps(filmes), 'application/json' 

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
    
def handle_post_filme(data):
    # Controla requisições POST para /filmes: valida dados, insere filme e redireciona
    try:
        # Validação dos campos obrigatorios
        required = ['titulo', 'ano', 'produtora', 'categoria'] # lista de campos que devem estar presentes
        if not all(key in data for key in required): # verificação de que todoas estão no JSON
            raise ValueError("Campos obrigatorios: titulo, ano, produtora, categoria")
        
        # validação tipos e formatos
        if not isinstance(data['titulo'], str) or not data['titulo'].strip(): # titulo não pode ser uma string vazia
            raise ValueError("Titulo não pode ser um campo vazio")
        if not isinstance(data['ano'], int) or not (1900 <= data['ano'] <= 2100): # ano deve ser int
            raise ValueError("Ano deve ser número inteiro entre 1900 e 2100.")
        
        id_produtora = get_id_by_name('produtora', data['produtora']) # busca ID da produtora pelo nome
        id_categoria = get_id_by_name('categoria', data['categoria']) # busca ID da categoria
        if not id_produtora or not id_categoria: # verifica se encontrados
            raise ValueError("Produtora ou categoria não encontradas.")
        
        # Processa relecionamentos opcionais - convert nomes em IDs
        atores = [get_id_by_name('ator', a) for a in data.get('atores', []) if get_id_by_name('ator', a)] # lista de atores
        diretores = [get_id_by_name('diretor', d) for d in data.get('diretores', []) if get_id_by_name('diretor', d)]
        categorias = [get_id_by_name('categoria', c) for c in data.get('categorias', []) if get_id_by_name('categoria', c)]
        linguagens = [get_id_by_name('linguagem', l) for l in data.get('linguagens', []) if get_id_by_name('linguagem', l)]
        
        # insere o filme e armazena dados para sucesso
        global ultimo_filme_inserido # acessa a variável global
        ultimo_filme_inserido = add_filme(data['titulo'], data['ano'], id_produtora, id_categoria, atores, diretores, categorias, linguagens) # chama inserção
        return 302, '/sucesso', 'redirect' # retorna redirecionamento para tela de sucesso
    
    except ValueError as e: # trata erros de validação
        return 400, json.dumps({'error': str(e)}), 'application/json'
    except Exception as e: # Trata outros erros
        return 500, json.dumps({"error": "Erro interno."}), 'application/json'


def handle_put_filme(id, data):
    # controla requisições PUT para /filmes/<id>: valida e atualiza filme
    try:
        # Validações similares ao POST 
        update_filme(id, data['titulo'], data['ano'], get_id_by_name('produtora', data['produtora']), get_id_by_name('categoria', data['categoria']),
                    [get_id_by_name('ator', a) for a in data.get('atores', [])], ...)
        return 200, '', 'text/plain' # sucesso sem corpo
    except Exception as e:
        return 400, json.dumps({"error": str(e)}), 'application/json'
    

def handle_delete_filme(id):
    # Controle requisições DELETE para /filmes/<id>: exclui filme
    try:
        delete_filme(id)
        return 200, '', 'text/plain' 
    except Exception as e:
        return 400, json.dumps({"error": str(e)}), 'application/json'