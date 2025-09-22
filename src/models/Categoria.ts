import { ID } from "./Post.js";
import { Publicacao } from "./Publicacao.js";

// Categoria 
export class Categoria {
  private readonly _id: ID;
  private _nome: string;
  private _posts: Set<string>;

  constructor(id: ID, nome: string) {
    this._id = id;
    this._nome = nome;
    this._posts = new Set();
  }

  get id(): ID {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(novo: string) {
    this._nome = novo;
  }

  /**
   * Associa um post à categoria
   */
  associar(post: Publicacao) {
    this._posts.add(post.id);
    post.associarCategoria(this);
  }

  /**
   * Desassocia um post da categoria
   */
  desassociar(post: Publicacao) {
    this._posts.delete(post.id);
    post.desassociarCategoria(this.id);
  }

  get postIds(): string[] {
    return Array.from(this._posts);
  }

  toJSON() {
    return {
      id: this._id,
      nome: this._nome,
      posts: this.postIds,
    };
  }
}