import { prisma } from "../../config/client/PrismaClient";
import bcrypt from "bcrypt";

export default class CreateUserController {
  async create(req: any, res: any) {
    const { nome, login, email, senha, telefone, foto, status } = req.body;

    try {
      // 🔹 1. Verifica se já existe um usuário com o mesmo e-mail ou login
      const userExists = await prisma.users.findFirst({
        where: {
          OR: [{ email }, { login }],
        },
      });

      if (userExists) {
        return res.status(400).json({
          message: "Usuário já existe com este login ou e-mail.",
        });
      }

      // 🔹 2. Criptografa a senha
      const senhaHash = await this.criptografar(senha);

      // 🔹 3. Cria o novo usuário
      const novoUsuario = await prisma.users.create({
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

      // 🔹 4. Remove a senha do retorno
      const { senha: _, ...usuarioSemSenha } = novoUsuario;

      // 🔹 5. Retorna a resposta
      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        data: usuarioSemSenha,
      });
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({
        message: "Erro ao criar usuário",
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
