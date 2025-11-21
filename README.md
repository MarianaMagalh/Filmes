# 🎬 Amores & Morangos - Gerenciador de Filmes

Bem-vindo ao **Amores & Morangos**, uma aplicação web Full Stack para gerenciamento e catálogo de filmes com uma estética retrô e vibrante. O projeto foca em uma experiência comunitária onde usuários sugerem títulos e administradores fazem a curadoria.

## 📖 Sobre o Projeto

O objetivo deste sistema é permitir a criação de um catálogo de filmes colaborativo. A principal regra de negócio é o **Sistema de Aprovação**: filmes adicionados por usuários comuns não aparecem imediatamente na lista principal; eles entram em uma fila de "Validação" para que um administrador aprove ou rejeite o conteúdo.

## 👥 Perfis de Usuário

O sistema possui dois níveis de acesso com permissões distintas:

### 👤 Usuário Comum (Membro)
- **Cadastro e Login:** Acesso seguro à plataforma.
- **Visualizar Catálogo:** Acesso à lista de filmes aprovados.
- **Filtros Inteligentes:** Busca por título e filtragem por tags coloridas (gênero, diretor, etc.).
- **Sugerir Filmes:** Pode preencher um formulário completo para adicionar um novo filme.
  - *Nota: O filme fica com status "Pendente" até ser aprovado.*

### 👑 Administrador (Admin)
- **Todas as funções do Usuário.**
- **Painel Administrativo:** Uma Home exclusiva com atalhos rápidos.
- **Validação de Filmes:** Acesso a uma área exclusiva para ver filmes pendentes e aprová-los ou rejeitá-los.
- **Adição Direta:** Filmes adicionados por admins entram direto no catálogo (status "Aprovado").
- **Gerenciamento Total:** Pode editar qualquer informação e excluir filmes do sistema.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido sem o uso de frameworks pesados no backend, focando na lógica pura de programação.

### Frontend
- **React.js + Vite:** Para uma interface rápida e reativa.
- **CSS Modules/Custom:** Estilização personalizada com paleta de cores específica.
- **Context API:** Para gerenciamento global de autenticação (Login/Logout).

### Backend
- **Python (Puro):** Servidor construído com `http.server` nativo.
- **MySQL Connector:** Para comunicação com o banco de dados.
- **Bcrypt:** Para criptografia segura de senhas.
- **JWT (JSON Web Token):** Para autenticação e segurança das rotas.

### Banco de Dados
- **MySQL (via XAMPP):** Banco de dados relacional para armazenar usuários, filmes e suas categorias.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js e NPM
- Python
- XAMPP (ou servidor MySQL)

### Passo a Passo

1. **Banco de Dados:**
   - Inicie o MySQL no XAMPP.
   - Crie o banco `filmes_db` e importe as tabelas (script SQL).

2. **Backend:**
   - cd back
   - py -m venv env
   - entre na env e ative ela
   - pip install -r requimentes.txt
   - python server.py

3. **Frontend**
    - cd front
    - cd filmes
    - npm i
    - npm run dev

## 🎨 Link do Figma

Tenha a acesso ao design do projeto e a documentação (via a aba de documentção)

https://www.figma.com/design/4l1BNEGfDvF9fqIJA8byHz/Sem-t%C3%ADtulo?node-id=0-1&t=GfQr5auZBI7FAWeW-1
