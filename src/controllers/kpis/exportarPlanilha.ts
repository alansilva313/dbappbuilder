import { prisma } from "../../config/client/PrismaClient"
import ExcelJS from "exceljs";

export default class ExportData {

    async export(req: any, res: any) {

        try {

            // BUSCA DOS DADOS VIA SQL RAW
            const data: any[] = await prisma.$queryRawUnsafe(`

                SELECT
                    ac.protocolo,
                    ac.metragem_inicial,
                    ac.coordenada_inicial,
                    ac.metragem_final,
                    ac.coordenada_final,

                    fb.tipo AS tipo_fibra,

                    ac.data_inicio,
                    ac.hora_inicio,
                    ac.data_fim,
                    ac.hora_fim,

                    us.nome AS usuario,
                    us.email,

                    GROUP_CONCAT(
                        CONCAT(
                            'Kit: ', ae.kit_bap,
                            ' | Alca: ', ae.alca,
                            ' | Placa: ', ae.placa_way,
                            ' | Espiral: ', ae.aspiral,
                            ' | Espinagem: ', ae.espinagem
                        ) SEPARATOR ' || '
                    ) AS etapas,

                    GROUP_CONCAT(ae.coordenada SEPARATOR ', ') AS coordenadas_etapas,

                    GROUP_CONCAT(af.imagem SEPARATOR ', ') AS fotos,

                    GROUP_CONCAT(mi.tipo SEPARATOR ', ') AS tipo_imagem

                FROM Acompanhamentos AS ac
                LEFT JOIN usuarios AS us 
                    ON ac.user_id = us.id
                LEFT JOIN fibras AS fb 
                    ON ac.tipo_fibra_id = fb.id
                LEFT JOIN acompanhamento_etapas AS ae 
                    ON ac.id = ae.id_acompanhamento
                LEFT JOIN AcompanhamentoFotos AS af 
                    ON ac.id = af.id_acompanhamento
                LEFT JOIN modelo_imagens AS mi 
                    ON af.modelo_foto_id = mi.id
                GROUP BY ac.id;
            `);

            // ================================
            // CRIAÇÃO DO EXCEL
            // ================================
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Acompanhamentos");

            // Cabeçalho automático baseado nas chaves do objeto retornado
            worksheet.columns = Object.keys(data[0] ?? {}).map(key => ({
                header: key.toUpperCase(),
                key,
                width: 30
            }));

            // Adicionar dados linha por linha
            data.forEach(row => worksheet.addRow(row));

            // Ajusta tamanho automático
            worksheet.columns.forEach((column: any) => {
                let maxLength = 10;
                column.eachCell?.({ includeEmpty: true }, (cell: any) => {
                    const value = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, value.length);
                });
                column.width = maxLength + 2;
            });

            // ================================
            // DOWNLOAD DO ARQUIVO
            // ================================
            const fileName = `acompanhamentos_${Date.now()}.xlsx`;

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileName}"`
            );

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true, message: "Erro ao gerar Excel" });
        }

    }
}
