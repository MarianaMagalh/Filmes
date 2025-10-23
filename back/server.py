from http.server import BaseHTTPRequestHandler, HTTPServer # cria servidor HTTP básico
import json # importa para parse de JSON em requisições
from controller import handle_get_filmes, handle_get_sucesso, handle_post_filme, handle_put_filme, handle_delete_filme

class FilmeHandler(BaseHTTPRequestHandler):
    # Classe para definir como o servidor responde a requisições HTTP
    # Cada método (do_GET, do_POST, etc) é chamado automaticamente baseado no tipo de requisição
    def do_GET(self):
        if self.path == '/filmes':
            if self.path == '/filmes':  # Se a URL for /filmes
                status, body, content_type = handle_get_filmes()  # Chama função do controlador para processar
                self.send_response(status)  # Envia código de status HTTP (ex: 200)
                self.send_header('Content-type', content_type)  # Define tipo de conteúdo (ex: JSON)
                self.send_header('Access-Control-Allow-Origin', '*')  # Adiciona header CORS para permitir requisições do React
                self.end_headers()  # Finaliza headers
                self.wfile.write(body.encode())  # Escreve o corpo da resposta (ex: JSON ou HTML)
            elif self.path == '/sucesso':  # Se for /sucesso
                status, body, content_type = handle_get_sucesso()  # Chama controlador
                self.send_response(status)
                self.send_header('Content-type', content_type)
                self.end_headers()
                self.wfile.write(body.encode())
            else:  # URL não reconhecida
                self.send_error(404)  # Envia erro 404
                
    def do_POST(self):
        # Método chamado para requisições POST (ex: adicionar filme)
        if self.path == '/filmes':  # Se for /filmes
            content_length = int(self.headers['Content-Length'])  # Obtém tamanho do corpo da requisição
            post_data = self.rfile.read(content_length)  # Lê os dados enviados (bytes)
            data = json.loads(post_data.decode())  # Converte bytes para string e depois para dicionário JSON
            status, body, content_type = handle_post_filme(data)  # Chama controlador com dados parseados
            if content_type == 'redirect':  # Se for um redirecionamento
                self.send_response(status)  # Status 302
                self.send_header('Location', body)  # Header de localização para redirecionar
                self.end_headers()  # Sem corpo
            else:  # Resposta normal
                self.send_response(status)
                self.send_header('Content-type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')  # CORS
                self.end_headers()
                self.wfile.write(body.encode())  # Escreve resposta
        else:
            self.send_error(404)
            
    def do_PUT(self):
        # Método chamado para requisições PUT (ex: editar filme)
        if self.path.startswith('/filmes/'):  # Se começar com /filmes/
            id = int(self.path.split('/')[-1])  # Extrai ID da URL (ex: /filmes/1 -> 1)
            content_length = int(self.headers['Content-Length'])
            put_data = self.rfile.read(content_length)
            data = json.loads(put_data.decode())  # Parse JSON
            status, body, content_type = handle_put_filme(id, data)  # Chama controlador
            self.send_response(status)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body.encode())
        else:
            self.send_error(404)

    def do_DELETE(self): 
        # Método chamado para requisições DELETE (ex: excluir filme)
        if self.path.startswith('/filmes/'):
            id = int(self.path.split('/')[-1])  # Extrai ID
            status, body, content_type = handle_delete_filme(id)  # Chama controlador
            self.send_response(status)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body.encode())
        else:
            self.send_error(404)
            
def run (server_class=HTTPServer, handler_class=FilmeHandler, port=8000):
    # Função para iniciar o servidor HTTP
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Servidor rodando na porta {port}...')
    httpd.serve_forever()# incia o loop infinito do servidor, escutando requisições indefinidamente
      
if __name__ == '__main__':
    # Bloco executado apenas se o script for radado diretamente 
    run()  
    