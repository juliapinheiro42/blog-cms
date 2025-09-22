import { Publicacao } from "../models/Publicacao.js";
import { ID } from "../models/Post.js";
import { Usuario } from "../models/Usuario.js";
import { PermissaoService } from "./PermissaoService.js";
import { Categoria } from "../models/Categoria.js";

// Repositório em memória simples para Publicacao.

class InMemoryPostRepository {
  private items: Map<ID, Publicacao> = new Map();

  save(pub: Publicacao) {
    this.items.set(pub.id, pub);
  }

  delete(id: ID) {
    this.items.delete(id);
  }

  findById(id: ID): Publicacao | undefined {
    return this.items.get(id);
  }

  findAll(): Publicacao[] {
    return Array.from(this.items.values());
  }

  findByAuthor(authorId: ID): Publicacao[] {
    return this.findAll().filter((p) => p.autor.id === authorId);
  }

  findByCategory(categoryId: ID): Publicacao[] {
    return this.findAll().filter((p) => p.categorias.includes(categoryId));
  }
}

//Serviço principal do domínio para gerenciar publicações.

export class BlogService {
  private repo = new InMemoryPostRepository();
  private permissao: PermissaoService;
  private idGenerator: () => ID;
  private categorias: Map<ID, Categoria> = new Map();

  constructor(permissao: PermissaoService, idGenerator: () => ID) {
    this.permissao = permissao;
    this.idGenerator = idGenerator;
  }

  // Cria e registra uma publicação (já construída).
   
  criarPublicacao(pub: Publicacao) {
    this.repo.save(pub);
    return pub;
  }

  // Deleta publicação se permitido.
   
  deletarPublicacao(id: ID, solicitante: Usuario): { ok: boolean; message: string } {
    const pub = this.repo.findById(id);
    if (!pub) {
      return { ok: false, message: "Publicação não encontrada" };
    }
    if (!this.permissao.canDelete(solicitante, pub)) {
      return { ok: false, message: "Permissão negada: não pode deletar esta publicação" };
    }
    this.repo.delete(id);
    return { ok: true, message: "Publicação deletada com sucesso" };
  }

  //Edita campos básicos de publicação (valida permissão).

  editarPublicacao(id: ID, solicitante: Usuario, dados: Partial<{ titulo: string; conteudo: string }>) {
    const pub = this.repo.findById(id);
    if (!pub) throw new Error("Publicação não encontrada");
    if (!this.permissao.canEdit(solicitante, pub)) {
      throw new Error("Permissão negada: não pode editar esta publicação");
    }
    if (dados.titulo) pub.titulo = dados.titulo;
    if (dados.conteudo) pub.conteudo = dados.conteudo;
    this.repo.save(pub);
    return pub;
  }

  // Busca por autor

  buscarPorAutor(autorId: ID): Publicacao[] {
    return this.repo.findByAuthor(autorId);
  }

  
   // Busca por categoria
   
  buscarPorCategoria(categoriaId: ID): Publicacao[] {
    return this.repo.findByCategory(categoriaId);
  }

  
  // Lista tudo
  
  listarTodas(): Publicacao[] {
    return this.repo.findAll();
  }

  
   // Adiciona categoria ao repositório de categorias (se já existir, retorna).
   
  criarCategoria(nome: string): Categoria {
    const id = this.idGenerator();
    const cat = new Categoria(id, nome);
    this.categorias.set(id, cat);
    return cat;
  }

  obterCategoria(id: ID): Categoria | undefined {
    return this.categorias.get(id);
  }

  listarCategorias(): Categoria[] {
    return Array.from(this.categorias.values());
  }
}