import { Publicacao } from "./Publicacao.js";
import { Usuario } from "./Usuario.js";
import { ID } from "./Post.js";

export class VideoPost extends Publicacao {
  private _url: string;
  private _duracao: number;

  constructor(id: ID, titulo: string, conteudo: string, autor: Usuario, url: string, duracao: number) {
    super(id, titulo, conteudo, autor);
    this._url = url;
    this._duracao = duracao;
  }

  get url(): string {
    return this._url;
  }

  get duracao(): number {
    return this._duracao;
  }

  toJSON() {
    return {
      ...this.toJSONBase(),
      url: this._url,
      duracao: this._duracao,
    };
  }
}
