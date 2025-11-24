import { prisma } from "../../config/client/PrismaClient";






function toSerializable(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )
    );
}

export default class PendenciasGeral {

    async pd(req: any, res: any) {
        try {

            const result: any = await prisma.$queryRawUnsafe(`
                SELECT
                    ac.id,
                    ac.protocolo,
                    us.nome AS usuario,
                    fb.tipo AS tipo_fibra,

                    COUNT(DISTINCT ae.id) AS total_postes,

                    -- STATUS DAS ETAPAS
                    CASE
                        WHEN COUNT(ae.id) = 0 THEN 'sem etapas'
                        WHEN SUM(
                            (ae.kit_bap = 1) AND
                            (ae.alca = 1) AND
                            (ae.placa_way = 1) AND
                            (ae.aspiral = 1) AND
                            (ae.espinagem = 1) AND
                            (ae.elegivel_sobra = 1) AND
                            (ae.sobra_padrao = 1)
                        ) = COUNT(ae.id)
                        THEN 'ok'
                        ELSE 'pendente'
                    END AS etapas_status,

                    -- CAMPOS OK (preenchidos somente quando TRUE)
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.kit_bap = 1 THEN 'kit_bap' END) AS ok_kit_bap,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.alca = 1 THEN 'alca' END) AS ok_alca,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.placa_way = 1 THEN 'placa_way' END) AS ok_placa_way,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.aspiral = 1 THEN 'aspiral' END) AS ok_aspiral,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.espinagem = 1 THEN 'espinagem' END) AS ok_espinagem,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.elegivel_sobra = 1 THEN 'elegivel_sobra' END) AS ok_elegivel_sobra,
                    GROUP_CONCAT(DISTINCT CASE WHEN ae.sobra_padrao = 1 THEN 'sobra_padrao' END) AS ok_sobra_padrao,

                    -- STATUS DAS FOTOS
                    CASE
                        WHEN SUM(af.tipo_foto = 'inicial') > 0
                         AND SUM(af.tipo_foto = 'andamento') > 0
                         AND SUM(af.tipo_foto = 'final') > 0
                        THEN 'ok'
                        ELSE 'faltando'
                    END AS fotos_status,

                    CASE WHEN SUM(af.tipo_foto = 'inicial') > 0 THEN 'inicial' END AS foto_inicial_ok,
                    CASE WHEN SUM(af.tipo_foto = 'andamento') > 0 THEN 'andamento' END AS foto_andamento_ok,
                    CASE WHEN SUM(af.tipo_foto = 'final') > 0 THEN 'final' END AS foto_final_ok,

                    -- STATUS FINAL
                    CASE
                        WHEN 
                            (SUM(
                                (ae.kit_bap = 1) AND
                                (ae.alca = 1) AND
                                (ae.placa_way = 1) AND
                                (ae.aspiral = 1) AND
                                (ae.espinagem = 1) AND
                                (ae.elegivel_sobra = 1) AND
                                (ae.sobra_padrao = 1)
                            ) = COUNT(ae.id))
                        AND (
                            SUM(af.tipo_foto = 'inicial') > 0 AND
                            SUM(af.tipo_foto = 'andamento') > 0 AND
                            SUM(af.tipo_foto = 'final') > 0
                        )
                        THEN 'tudo ok'
                        ELSE 'pendente'
                    END AS status_geral

                FROM Acompanhamentos ac
                LEFT JOIN usuarios us ON ac.user_id = us.id
                LEFT JOIN fibras fb ON ac.tipo_fibra_id = fb.id
                LEFT JOIN acompanhamento_etapas ae ON ac.id = ae.id_acompanhamento
                LEFT JOIN AcompanhamentoFotos af ON ac.id = af.id_acompanhamento

                GROUP BY ac.id
                ORDER BY ac.createdAt DESC;
            `);

            return res.status(200).json({
                success: true,
                total: result.length,
                data: toSerializable(result)
            });

        } catch (error: any) {
            console.error("Erro ao buscar pendências:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao buscar pendências.",
                error: error.message
            });
        }
    }
}
