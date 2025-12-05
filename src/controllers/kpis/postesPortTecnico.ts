import { prisma } from "../../config/client/PrismaClient";

function toSerializable(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )
    );
}

export default class PostesPorTecnico {

    async buscar(req: any, res: any) {
        try {
            const { tecnico_id, tecnico_nome } = req.query;

            let where = "";
            let params: any[] = [];

            // --------------------------
            // 🔍 Monta o WHERE seguro
            // --------------------------

            if (tecnico_id) {
                where = `WHERE us.id = ?`;
                params.push(tecnico_id); // ID é string (UUID)
            }
            else if (tecnico_nome) {
                where = `WHERE us.nome LIKE ?`;
                params.push(`%${tecnico_nome}%`);
            }

            // --------------------------
            // 🔥 Query usando parâmetros seguros
            // --------------------------

            const result: any = await prisma.$queryRawUnsafe(`
                SELECT
                    us.id AS id_tecnico,
                    us.nome AS tecnico,
                    COUNT(ae.id) AS total_postes
                FROM usuarios us
                LEFT JOIN Acompanhamentos ac 
                    ON ac.user_id = us.id
                LEFT JOIN acompanhamento_etapas ae 
                    ON ac.id = ae.id_acompanhamento
                ${where}
                GROUP BY us.id, us.nome
                ORDER BY total_postes DESC;
            `, ...params);

            // 🔥 Soma total geral
            const totalPostesGeral = result.reduce(
                (sum: number, item: any) => sum + Number(item.total_postes),
                0
            );

            return res.status(200).json({
                success: true,
                total_registros: result.length,
                total_postes_geral: totalPostesGeral,
                data: toSerializable(result)
            });

        } catch (error: any) {
            console.error("Erro ao buscar postes por técnico:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao buscar postes por técnico.",
                error: error.message
            });
        }
    }
}
