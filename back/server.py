from http.server import BaseHTTPRequestHandler, HTTPServer # cria servidor HTTP básico
import json # importa para parse de JSON em requisições
from urllib.parse import urlparse, parse_qs

from controller import (  # Importa handlers
    handle_get_filmes, handle_get_filme_by_id, handle_post_register, handle_post_login,
    handle_post_filme, handle_put_filme, handle_delete_filme, handle_post_approve_movie
)

class FilmeHandler(BaseHTTPRequestHandler):
    # Classe para definir como o servidor responde a requisições HTTP
    def do_GET(self):
        # 1. Analisa a URL completa
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # 2. Faz o parsing robusto dos parâmetros
        query_params = parse_qs(parsed_url.query)
        
        status = 404
        body = json.dumps({"error": "Recurso não encontrado"})
        content_type = 'application/json'

        if path == '/filmes':  # Lista de filmes com filtros
            # Passa query_params para o handler
            status, body, content_type = handle_get_filmes(query_params)
            
        elif path.startswith('/filmes/'):  # Detalhes de um filme
            try:
                # Pega o ID da URL. Exemplo: /filmes/123
                id_str = path.split('/')[-1]
                if id_str.isdigit():
                    id = int(id_str)
                    status, body, content_type = handle_get_filme_by_id(id)
                else:
                    status = 400
                    body = json.dumps({"error": "ID de filme inválido"})
            except ValueError:
                status = 400
                body = json.dumps({"error": "ID de filme inválido"})

        # Resposta (Mantido como estava)
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*') 
        self.end_headers()
        self.wfile.write(body.encode())
                
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])  # Tamanho do corpo
        data = json.loads(self.rfile.read(content_length).decode())  # Parse JSON

        if self.path == '/register':  # Cadastro
            status, body, content_type = handle_post_register(data)
        elif self.path == '/login':  # Login
            status, body, content_type = handle_post_login(data)
        elif self.path == '/aprovacao_filme':
            status, body, content_type = handle_post_approve_movie(data, self.headers)
        elif self.path == '/filmes':  # Adicionar filme
            status, body, content_type = handle_post_filme(data, self.headers)  # Passa headers para auth
        else:
            self.send_error(404)

        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body.encode())
            
    def do_PUT(self):
        if self.path.startswith('/filmes/'):  # Editar filme
            id = int(self.path.split('/')[-1])
            content_length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(content_length).decode())
            status, body, content_type = handle_put_filme(id, data, self.headers)

            self.send_response(status)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body.encode())
        else:
            self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/filmes/'):  # Deletar filme
            id = int(self.path.split('/')[-1])
            status, body, content_type = handle_delete_filme(id, self.headers)
            self.send_response(status)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body.encode())
        else:
            self.send_error(404)
            
    # método para lidar com as requisições CORS preflight
    def do_OPTIONS(self):
        self.send_response(200)
        # Permite requisições de qualquer origem (seu React)
        self.send_header('Access-Control-Allow-Origin', '*')
        # Permite os métodos usados no seu CRUD
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        # Permite que o frontend envie o Content-Type (JSON) e o Authorization (JWT Token)
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
            
            
# Função para iniciar o servidor
def run(server_class=HTTPServer, handler_class=FilmeHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Servidor rodando na porta {port}...')
    httpd.serve_forever()  # Loop infinito

if __name__ == '__main__':
    run()  # Executa o servidor
    