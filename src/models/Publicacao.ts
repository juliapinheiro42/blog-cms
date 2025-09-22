import { Comentario } from "./Comentários.js";
import { Usuario } from "./Usuario.js";
import { ID } from "./Post.js";
import { Categoria } from "./Categoria.js";

/**
 * Classe abstrata representando uma publicação genérica (Artigo, VideoPost, etc).
 * Implementa comentários, likes, e funcionalidades comuns.
 */
export abstract class Publicacao {
  protected readonly _id: ID;
  protected _titulo: string;
  protected _conteudo: string;
  protected _autor: Usuario;
  protected _comentarios: Comentario[];
  protected _likes: Set<string>; // ids de usuarios que curtiram
  protected _criadoEm: Date;
  protected _categorias: Set<string>; // ids de categorias

  constructor(id: ID, titulo: string, conteudo: string, autor: Usuario) {
    this._id = id;
    this._titulo = titulo;
    this._conteudo = conteudo;
    this._autor = autor;
    this._comentarios = [];
    this._likes = new Set();
    this._criadoEm = new Date();
    this._categorias = new Set();
  }

  get id(): ID {
    return this._id;
  }

  get titulo(): string {
    return this._titulo;
  }

  set titulo(novo: string) {
    this._titulo = novo;
  }

  get conteudo(): string {
    return this._conteudo;
  }

  set conteudo(novo: string) {
    this._conteudo = novo;
  }

  get autor(): Usuario {
    return this._autor;
  }

  /**
   * Permite alterar o autor apenas por meio de chamada que prove quem solicita;
   * validação de permissão deve ser feita por quem chama (ex.: BlogService).
   */
  alterarAutor(novoAutor: Usuario) {
    this._autor = novoAutor;
  }

  get criadoEm(): Date {
    return this._criadoEm;
  }

  get comentarios(): Comentario[] {
    return this._comentarios.slice();
  }

  get categorias(): string[] {
    return Array.from(this._categorias);
  }

  /**
   * Associa uma categoria (por id)
   */
  associarCategoria(categoria: Categoria) {
    this._categorias.add(categoria.id);
    // não altera o objeto categoria aqui para evitar ciclos infinitos:
    // a associação deve ser feita em ambos os lados por quem chama.
  }

  desassociarCategoria(categoriaId: ID) {
    this._categorias.delete(categoriaId);
  }

  /**
   * Adiciona comentário à publicação.
   * @param comentario Comentario já construído
   */
  adicionarComentarioObj(comentario: Comentario) {
    this._comentarios.push(comentario);
  }

  /**
   * Conveniência: cria e adiciona comentário.
   */
  adicionarComentario(texto: string, autor: Usuario, idGenerator: () => ID) {
    const comentario = new Comentario(idGenerator(), texto, autor);
    this._comentarios.push(comentario);
    return comentario;
  }

  /**
   * Adiciona like por usuário (id)
   */
  adicionarLike(usuario: Usuario) {
    this._likes.add(usuario.id);
  }

  /**
   * Remove like
   */
  removerLike(usuario: Usuario) {
    this._likes.delete(usuario.id);
  }

  obterTotalLikes(): number {
    return this._likes.size;
  }

  /**
   * Retorna resumo do conteúdo (primeiros 100 caracteres).
   */
  get resumoConteudo(): string {
    if (this._conteudo.length <= 100) return this._conteudo;
    return this._conteudo.slice(0, 100);
  }

  /**
   * Exibe resumo legível no console.
   */
  exibir(): string {
    return `[${this._id}] ${this._titulo} by ${this._autor.nome} - ${this.resumoConteudo} (${this.obterTotalLikes()} likes, ${this._comentarios.length} comentários)`;
  }

  // Serialização padrão para classes filhas.
  toJSONBase() {
    return {
      id: this._id,
      tipo: this.constructor.name,
      titulo: this._titulo,
      conteudo: this._conteudo,
      resumoConteudo: this.resumoConteudo,
      autor: this._autor.toJSON(),
      comentarios: this._comentarios.map((c) => c.toJSON()),
      likes: Array.from(this._likes),
      totalLikes: this.obterTotalLikes(),
      criadoEm: this._criadoEm.toISOString(),
      categorias: this.categorias,
    };
  }

  abstract toJSON(): any;
}