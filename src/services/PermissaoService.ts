import { Usuario } from "../models/Usuario.js";
import { Publicacao } from "../models/Publicacao.js";
import { Papel } from "../models/Post.js";

/**
 * Centraliza regras de permissão no domínio.
 *
 * Regras definidas:
 * - Admin: pode criar, editar, deletar qualquer publicação; pode atribuir papéis.
 * - Editor: pode criar e editar qualquer publicação; NÃO pode deletar publicações de outros autores.
 * - Leitor: pode criar (se implementado), editar e deletar apenas suas próprias publicações.
 *
 * Observação: "editar" aqui é uma permissão genérica — atualizações específicas
 * devem ser validadas pelo serviço que chama (BlogService).
 */
export class PermissaoService {
  
  canDelete(usuario: Usuario, publicacao: Publicacao): boolean {
    if (usuario.papel === Papel.Admin) return true;
    if (usuario.papel === Papel.Editor) {
      // Editor só deleta seus próprios posts
      return usuario.id === publicacao.autor.id;
    }
    // Leitor: só pode deletar seus próprios posts
    return usuario.id === publicacao.autor.id;
  }

  /**
   * Verifica se o usuário pode editar a publicação.
   */
  canEdit(usuario: Usuario, publicacao: Publicacao): boolean {
    if (usuario.papel === Papel.Admin) return true;
    if (usuario.papel === Papel.Editor) return true;
    return usuario.id === publicacao.autor.id;
  }

  /**
   * Verifica se o usuário pode atribuir papéis.
   */
  canAssignRole(usuario: Usuario): boolean {
    return usuario.papel === Papel.Admin;
  }
}
