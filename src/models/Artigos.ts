import { Publicacao } from "./Publicacao.js";
import { Usuario } from "./Usuario.js";
import { ID } from "./Post.js";

//Artigo
export class Artigo extends Publicacao {
  private _resumo?: string;

  constructor(id: ID, titulo: string, conteudo: string, autor: Usuario, resumo?: string) {
    super(id, titulo, conteudo, autor);
    this._resumo = resumo;
  }

  get resumo(): string | undefined {
    return this._resumo;
  }

  set resumo(texto: string | undefined) {
    this._resumo = texto;
  }

  toJSON() {
    return {
      ...this.toJSONBase(),
      resumo: this._resumo,
    };
  }
}