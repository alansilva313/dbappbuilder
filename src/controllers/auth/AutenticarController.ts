import { prisma } from "../../config/client/PrismaClient";
import bcrypt from "bcrypt";

export default class AutenticarController {
  async auth(req: any, res: any) {
    const { user, senha } = req.body; 
    // "identificador" pode ser tanto login quanto email

    try {
      // 🔹 1. Verifica se o usuário existe (por email OU login)
      const usuario = await prisma.users.findFirst({
        where: {
          OR: [{ email: user }, { login: user }],
        },
      });

      if (!usuario) {
        return res.status(404).json({
          message: "Falha ao autenticar-se, verifique os dados e tente novamente!",
        });
      }

      // 🔹 2. Verifica se a senha está correta
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          message: "Falha ao autenticar-se, verifique os dados e tente novamente!",
        });
      }

      // 🔹 3. Remove a senha do retorno
      const { senha: _, ...usuarioSemSenha } = usuario;

      // 🔹 4. Retorna sucesso
      return res.status(200).json({
        message: "Autenticação realizada com sucesso!",
        data: usuarioSemSenha,
      });
    } catch (error: any) {
      console.error("Erro ao autenticar usuário:", error);
      return res.status(500).json({
        message: "Erro interno ao autenticar usuário.",
        error: error.message || error,
      });
    }
  }
}
