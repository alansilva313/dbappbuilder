import { prisma } from "../../config/client/PrismaClient";

export default class MetragemPorFibraKpi {
  async metric(req: any, res: any) {
    try {
      // ✅ Filtros opcionais vindos da requisição (GET ou POST)
      const { dataInicio, dataFim, tipoFibra } = req.query; 

      // ✅ Monta o filtro dinâmico do Prisma
      const where: any = {};

      // 🔹 Validação segura das datas
      const isDataInicioValida = dataInicio && !isNaN(Date.parse(dataInicio));
      const isDataFimValida = dataFim && !isNaN(Date.parse(dataFim));

      if (isDataInicioValida || isDataFimValida) {
        where.createdAt = {};

        if (isDataInicioValida) {
          where.createdAt.gte = new Date(dataInicio);
        }

        if (isDataFimValida) {
          where.createdAt.lte = new Date(dataFim);
        }
      }

      // 🔹 Filtro por tipo de fibra (opcional)
      if (tipoFibra) {
        where.Fibras = {
          tipo: tipoFibra,
        };
      }

      // ✅ Consulta com filtros aplicados
      const result: any = await prisma.acompanhamentos.findMany({
        where,
        include: {
          Fibras: true,
        },
      });

      // ✅ Agrupar e somar por tipo de fibra
      const agrupado = result.reduce((acc: any, item: any) => {
        const tipo = item.Fibras?.tipo || "Desconhecido";
        const metragemInicial = parseFloat(item.metragem_inicial) || 0;
        const metragemFinal = parseFloat(item.metragem_final) || 0;

        if (!acc[tipo]) {
          acc[tipo] = {
            tipo,
            metragem_inicial: 0,
            metragem_final: 0,
            total: 0,
          };
        }

        acc[tipo].metragem_inicial += metragemInicial;
        acc[tipo].metragem_final += metragemFinal;
        acc[tipo].total += metragemInicial + metragemFinal;

        return acc;
      }, {});

      const metricas = Object.values(agrupado);

      return res.status(200).json({
        message: "Métrica por tipo de fibra",
        filtros_aplicados: {
          dataInicio: isDataInicioValida ? dataInicio : null,
          dataFim: isDataFimValida ? dataFim : null,
          tipoFibra: tipoFibra || null,
        },
        data: metricas,
      });

    } catch (error) {
      console.error("❌ Erro ao calcular métricas:", error);
      return res.status(500).json({
        message: "Erro ao calcular métricas",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
