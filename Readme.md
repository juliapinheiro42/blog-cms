# Blog CMS — Ferramenta de Gerenciamento de Conteúdo 
## 📖 Descrição

Este projeto é uma **ferramenta de gerenciamento de conteúdo (CMS) para blogs**, desenvolvida inteiramente em **TypeScript** com foco em **lógica de domínio e regras de negócio**.  
Ele foi criado para demonstrar **conceitos de orientação a objetos, herança, polimorfismo, encapsulamento e validação de permissões**, sem depender de frameworks externos ou banco de dados.

A persistência é feita **em memória**, e toda a interação é demonstrada via `console.log` no arquivo `index.ts`.

---

## 📂 Estrutura de Pastas

blog-cms/
├─ src/
│ ├─ models/
│ │ ├─ Publicacao.ts
│ │ ├─ Artigo.ts
│ │ ├─ VideoPost.ts
│ │ ├─ Usuario.ts
│ │ ├─ Post.ts
│ │ ├─ Comentario.ts
│ │ └─ Categoria.ts
│ ├─ services/
│ │ ├─ BlogService.ts
│ │ └─ PermissaoService.ts
│ ├─ utils/
│ │ └─ Serializer.ts
│ └─ index.ts
├─ diagrams/
│ └─ uml.md
├─ package.json
├─ tsconfig.json
├─ README.md
└─ .gitignore

---

## 🚀 Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/juliapinheiro42/blog-cms.git
cd 1433-JuliaFarias-Post
npm install
npm run start

🛠️ Tecnologias Utilizadas

TypeScript (target ES2020)

Node.js

ts-node

📊 Funcionalidades Demonstradas em index.ts

 Criação de 3 usuários: Admin, Editor, Leitor.

 Criação de 4 publicações (Artigo + VideoPost).

 Associação de categorias.

 Inclusão de comentários.

 Likes entre usuários.

 Serialização para JSON.

 Tentativa de Leitor deletar post → falha.

 Admin consegue deletar post de outro.

 Getter resumoConteudo limita a 100 caracteres.
```
