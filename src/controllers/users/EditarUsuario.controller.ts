import { prisma } from "../../config/client/PrismaClient";
import bcrypt from "bcrypt";

export default class UpdateUserController {
  async update(req: any, res: any) {
    const { id } = req.params; // id do usuário a ser editado
    const { nome, login, email, senha, telefone, foto, status } = req.body;

    try {
      // 🔹 1. Verifica se o usuário existe
      const usuario = await prisma.users.findUnique({ where: { id } });
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // 🔹 2. Verifica se o login ou email já estão em uso por outro usuário
      const duplicado = await prisma.users.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [{ email }, { login }],
            },
          ],
        },
      });

      if (duplicado) {
        return res.status(400).json({
          message: "Outro usuário já utiliza este login ou e-mail.",
        });
      }

      // 🔹 3. Se a senha for fornecida, criptografa
      let senhaHash = usuario.senha;
      if (senha) {
        senhaHash = await this.criptografar(senha);
      }

      // 🔹 4. Atualiza o usuário
      const usuarioAtualizado = await prisma.users.update({
        where: { id },
        data: {
          nome,
          login,
          email,
          senha: senhaHash,
          telefone,
          foto,
          status,
        },
      });

      // 🔹 5. Remove a senha do retorno
      const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

      return res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        data: usuarioSemSenha,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({
        message: "Erro ao atualizar usuário",
        error: error.message || error,
      });
    }
  }

  // 🔹 Função utilitária de criptografia
  async criptografar(senha: string) {
    const salt = 10;
    return await bcrypt.hash(senha, salt);
  }
}
