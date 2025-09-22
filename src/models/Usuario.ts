import { ID, Papel } from "./Post.js";

/**
 * Representa um usuário do sistema.
 */
export class Usuario {
  private readonly _id: ID;
  private _nome: string;
  private _senha: string;
  private _papel: Papel;

  /**
   * @param id Identificador único
   * @param nome Nome do usuário
   * @param senha Senha (privada)
   * @param papel Papel do usuário (Admin, Editor, Leitor)
   */
  constructor(id: ID, nome: string, senha: string, papel: Papel = Papel.Leitor) {
    this._id = id;
    this._nome = nome;
    this._senha = senha;
    this._papel = papel;
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

  get papel(): Papel {
    return this._papel;
  }

  /**
   * Atribui um papel ao usuário.
   * A validação de quem pode chamar isso é responsabilidade do PermissaoService/serviços.
   */
  atribuirPapel(papel: Papel) {
    this._papel = papel;
  }

  /**
   * Publica um post (delegado para BlogService normalmente).
   */
  // A implementação lógica de criação de Publicacao se dá no BlogService.
  // Usuário expõe ações de conveniência para a API do domínio.
  toJSON() {
    return {
      id: this._id,
      nome: this._nome,
      papel: this._papel,
      // senha omitida intencionalmente
    };
  }
}