import { ID } from "./Post.js";
import { Usuario } from "./Usuario.js";

// Comentário 
export class Comentario {
  private readonly _id: ID;
  private readonly _texto: string;
  private readonly _autor: Usuario;
  private readonly _criadoEm: Date;

  constructor(id: ID, texto: string, autor: Usuario) {
    this._id = id;
    this._texto = texto;
    this._autor = autor;
    this._criadoEm = new Date();
  }

  get id(): ID {
    return this._id;
  }

  get texto(): string {
    return this._texto;
  }

  get autor(): Usuario {
    return this._autor;
  }

  get criadoEm(): Date {
    return this._criadoEm;
  }

  // Serialização para API 
  toJSON() {
    return {
      id: this._id,
      texto: this._texto,
      autor: this._autor.toJSON(),
      criadoEm: this._criadoEm.toISOString(),
    };
  }
}