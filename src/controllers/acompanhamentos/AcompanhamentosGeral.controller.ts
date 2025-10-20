import { prisma } from "../../config/client/PrismaClient";

export default class AcompanhamentosGeralController {

  // Listar acompanhamentos por técnico (user_id opcional para filtrar)
  async listar(req: any, res: any) {
    try {
     

      const acompanhamentos = await prisma.acompanhamentos.findMany({
      
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
          AcompanhamentoFotos: {
            include: {
              ModelosImagens: true
            }
          },
        
           
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
