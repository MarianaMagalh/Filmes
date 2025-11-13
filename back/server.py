from http.server import BaseHTTPRequestHandler, HTTPServer # cria servidor HTTP básico
import json # importa para parse de JSON em requisições
from controller import (  # Importa handlers
    handle_get_filmes, handle_get_filme_by_id, handle_post_register, handle_post_login,
    handle_post_filme, handle_put_filme, handle_delete_filme, handle_post_approve_movie
)

class FilmeHandler(BaseHTTPRequestHandler):
    # Classe para definir como o servidor responde a requisições HTTP
    def do_GET(self):
        if self.path == '/filmes':  # Lista de filmes com filtros
            query_params = {}  # Parse simples de query params (ex.: ?titulo=batman)
            if '?' in self.path:
                params = self.path.split('?')[1].split('&')
                for param in params:
                    key, value = param.split('=')
                    query_params[key] = [value]  # Simula formato de query
            status, body, content_type = handle_get_filmes(query_params)
        elif self.path.startswith('/filmes/'):  # Detalhes de um filme
            id = int(self.path.split('/')[-1])
            status, body, content_type = handle_get_filme_by_id(id)
        else:
            self.send_error(404)

        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # Permite CORS para React
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
            
            
# Função para iniciar o servidor
def run(server_class=HTTPServer, handler_class=FilmeHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Servidor rodando na porta {port}...')
    httpd.serve_forever()  # Loop infinito

if __name__ == '__main__':
    run()  # Executa o servidor
    