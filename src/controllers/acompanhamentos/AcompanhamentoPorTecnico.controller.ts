import { prisma } from "../../config/client/PrismaClient";

export default class AcompanhamentoPorTecnicoController {

  // Listar acompanhamentos por técnico (user_id opcional para filtrar)
  async listar(req: any, res: any) {
    try {
      const { user_id } = req.query; // se quiser filtrar por técnico específico

      const acompanhamentos = await prisma.acompanhamentos.findMany({
        where: user_id ? { user_id } : {}, // filtra se tiver user_id
        include: {

        
          Users: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
            },
          },
        
          Fibras: {
            select: {
              id: true,
              tipo: true,
            },
          },
          AcompanhamentoEtapas: true,
          AcompanhamentoFotos: true
        
           
        },
        
        orderBy: {
          data_inicio: "desc",
        },
      });

      return res.status(200).json({
        message: "Listagem de acompanhamentos por técnico",
        result: acompanhamentos,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao listar acompanhamentos", error });
    }
  }
}
