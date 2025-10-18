import { prisma } from "../../config/client/PrismaClient";

export default class ListarAcompanhamentoController {
    async listar(req: any, res: any) {
        const { id_acompanhamento }: any = req.query;

        try {
            let result;

            if (id_acompanhamento) {
                // Buscar apenas um acompanhamento pelo ID
                result = await prisma.acompanhamentos.findFirst({
                    where: { id: id_acompanhamento },
                    include: {
                        Fibras: true,
                        AcompanhamentoEtapas: true
                    }
                });
            } else {
                // Buscar todos os acompanhamentos
                result = await prisma.acompanhamentos.findMany();
            }

            return res.status(200).json({
                message: "Listando acompanhamento(s)",
                data: result,
            });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao listar acompanhamento",
                error: error.message,
            });
        }
    }
}
