import { Usuario } from "./models/Usuario.js";
import { Papel, ID } from "./models/Post.js";
import { Artigo } from "./models/Artigos.js";
import { VideoPost } from "./models/VideoPost.js";
import { BlogService } from "./services/BlogService.js";
import { PermissaoService } from "./services/PermissaoService.js";
import { Comentario } from "./models/Comentários.js";
import { Categoria } from "./models/Categoria.js";
import { Publicacao } from "./models/Publicacao.js";

// Gerador de IDs simples 
function simplesId(prefix: string = ""): string {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

// Instancia serviços
const permissaoService = new PermissaoService();
const blogService = new BlogService(permissaoService, () => simplesId("id_"));

// Passo 1: criação de 3 usuários (Admin, Editor, Leitor)
const admin = new Usuario(simplesId("u_"), "Alice Admin", "senha123", Papel.Admin);
const editor = new Usuario(simplesId("u_"), "Eduardo Editor", "senha123", Papel.Editor);
const leitor = new Usuario(simplesId("u_"), "Lucas Leitor", "senha123", Papel.Leitor);

console.log("[PASSO] criação de usuários — resultado: ", { admin: admin.toJSON(), editor: editor.toJSON(), leitor: leitor.toJSON() });

// Passo 2: criação de categorias
const catTech = blogService.criarCategoria("Tecnologia");
const catVida = blogService.criarCategoria("Estilo de Vida");
console.log("[PASSO] categorias criadas — resultado: ", { catTech: catTech.toJSON(), catVida: catVida.toJSON() });

// Passo 3: criação de 4 publicações (mix Artigo + VideoPost)
const artigo1 = new Artigo(simplesId("p_"), "Como TypeScript ajuda no design", "TypeScript melhora a manutenção do código e oferece tipagem estática. ".repeat(5), editor, "Breve sobre TypeScript");
const artigo2 = new Artigo(simplesId("p_"), "Pequenos hábitos para produtividade", "Comece o dia com foco e objetivos claros.", leitor);
const video1 = new VideoPost(simplesId("p_"), "Entrevista com especialista", "Uma entrevista profunda sobre arquitetura de software.", admin, "https://youtu.be/exemplo", 3600);
const video2 = new VideoPost(simplesId("p_"), "Vlog: rotina diária", "Mostrando dia a dia e organização.", editor, "https://youtu.be/vlog", 600);

blogService.criarPublicacao(artigo1);
blogService.criarPublicacao(artigo2);
blogService.criarPublicacao(video1);
blogService.criarPublicacao(video2);

console.log("publicações criadas — resultado: ", blogService.listarTodas().map((p) => p.toJSON()));

// Passo 4: associar categorias a posts
catTech.associar(artigo1); 
catVida.associar(artigo2);
catTech.associar(video1);
catVida.associar(video2);

console.log(" associações categorias -> posts — resultado: ");
console.log(" - categoria Tech posts:", catTech.postIds);
console.log(" - categoria Vida posts:", catVida.postIds);

// Passo 5: adicionar comentários a posts
const c1 = artigo1.adicionarComentario("Ótimo texto, ajudou muito!", leitor, () => simplesId("c_"));
const c2 = artigo1.adicionarComentario("Concordo com os pontos apresentados.", admin, () => simplesId("c_"));
const c3 = video1.adicionarComentario("Gostei da entrevista!", editor, () => simplesId("c_"));

console.log(" comentários adicionados — resultado: ", {
  artigo1: artigo1.comentarios.map((c) => c.toJSON()),
  video1: video1.comentarios.map((c) => c.toJSON()),
});

// Passo 6: likes por diferentes usuários
artigo1.adicionarLike(leitor);
artigo1.adicionarLike(admin);
video1.adicionarLike(editor);
video1.adicionarLike(leitor);

console.log(" likes adicionados — resultado: ", {
  artigo1_totalLikes: artigo1.obterTotalLikes(),
  video1_totalLikes: video1.obterTotalLikes(),
});

// Passo 7: serializar posts e usuários em JSON (sem expor senha)
console.log(" serialização usuário — resultado: ", admin.toJSON());
console.log(" serialização publicações — resultado: ",
  JSON.stringify([artigo1.toJSON(), video1.toJSON()], null, 2)
);

// Passo 8: tentativa de um Leitor deletar post de outro usuário (deve falhar)
const alvo = artigo1; 
const tentativaLeitorDelete = blogService.deletarPublicacao(alvo.id, leitor);
console.log(" leitor tenta deletar post de outro — resultado: ", tentativaLeitorDelete);

// Passo 9: Admin deleta post de outro usuário (deve passar)
const tentativaAdminDelete = blogService.deletarPublicacao(alvo.id, admin);
console.log(" admin deleta post de outro — resultado: ", tentativaAdminDelete);

// Verifica que post foi removido
console.log(" listar publicações após deleção — resultado: ", blogService.listarTodas().map((p) => p.toJSON()));

// Passo 10: editar publicação (Editor edita publicação de outro usuário - permitido por regra)
try {
  const qualquerPost = blogService.listarTodas()[0];
  const antes = qualquerPost.toJSON();
  const editado = blogService.editarPublicacao(qualquerPost.id, editor, { titulo: "Título editado pelo Editor" });
  console.log(" Editor editou publicação de outro — antes:", antes, "depois:", editado.toJSON());
} catch (err: any) {
  console.log(" falha ao editar (não esperado): ", err.message);
}

// Passo 11: resumoConteudo tem no máximo 100 chars
const pequeno = new Artigo(simplesId("p_"), "Pequeno", "curto", admin);
console.log(" resumoConteudo (curto) — resultado: ", pequeno.resumoConteudo);

// Passo 12: demonstra operação polimórfica: listar todas e exibir com exibir()
console.log(" exibição polimórfica de publicações — resultado:");
blogService.listarTodas().forEach((p) => {
  console.log(" - exibir():", p.exibir());
});

// Passo 13: demonstrar alterarAutor via método (com validação externa)
const postParaTrocar = blogService.listarTodas()[0];
if (permissaoService.canEdit(admin, postParaTrocar)) {
  postParaTrocar.alterarAutor(leitor);
  console.log(" admin alterou autor do post — resultado:\n",
  JSON.stringify(postParaTrocar.toJSON(), null, 2)
);
} else {
  console.log(" admin não pode alterar autor (improvável) — resultado:", postParaTrocar.toJSON());
}

console.log(" demonstração final — todos os posts:\n",
  JSON.stringify(blogService.listarTodas().map((p) => p.toJSON()), null, 2)
);
