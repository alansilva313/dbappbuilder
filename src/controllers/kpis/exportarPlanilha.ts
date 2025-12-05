import { prisma } from "../../config/client/PrismaClient";
import ExcelJS from "exceljs";
import { Request, Response } from "express";

// Tipagem do retorno do SQL
export interface IAcompanhamentoSQL {
    id_acompanhamento: number | string;
    protocolo: string | null;
    metragem_inicial: number | string | null;
    coordenada_inicial: string | null;
    metragem_final: number | string | null;
    coordenada_final: string | null;

    tipo_fibra: string | null;

    data_inicio: Date | string | null;
    hora_inicio: string | null;
    data_fim: Date | string | null;
    hora_fim: string | null;

    usuario: string | null;
    email: string | null;

    id_etapa: number | string | null;
    kit_bap: string | null;
    alca: string | null;
    placa_way: string | null;
    aspiral: string | null;
    espinagem: string | null;
    coordenada_etapa: string | null;
}

// Remove BigInt
function fixBigInts<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(item => fixBigInts(item)) as T;
    }

    if (obj !== null && typeof obj === "object") {
        const newObj: any = {};

        for (const key in obj as any) {
            const value = (obj as any)[key];

            if (typeof value === "bigint") {
                newObj[key] = value.toString();
            } else if (typeof value === "object") {
                newObj[key] = fixBigInts(value);
            } else {
                newObj[key] = value;
            }
        }

        return newObj;
    }

    return obj;
}

// Converte Date → string para todas propriedades
function fixDates<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(item => fixDates(item)) as T;
    }

    if (obj !== null && typeof obj === "object") {
        const newObj: any = {};

        for (const key in obj as any) {
            const value = (obj as any)[key];

            if (value instanceof Date) {
                newObj[key] = value.toISOString().split("T")[0];
            } else if (typeof value === "object") {
                newObj[key] = fixDates(value);
            } else {
                newObj[key] = value;
            }
        }

        return newObj;
    }

    return obj;
}

export default class ExportData {

    async export(req: Request, res: Response) {

        try {

            const data = await prisma.$queryRawUnsafe<IAcompanhamentoSQL[]>(`
            SELECT
    ac.id AS id_acompanhamento,
    ac.protocolo,
    ac.metragem_inicial,
    ac.coordenada_inicial,
    ac.metragem_final,
    ac.coordenada_final,

    fb.tipo AS tipo_fibra,

    DATE_FORMAT(ac.data_inicio, '%Y-%m-%d') AS data_inicio,
    ac.hora_inicio,
    DATE_FORMAT(ac.data_fim, '%Y-%m-%d') AS data_fim,
    ac.hora_fim,

    us.nome AS usuario,
    us.email,

    ae.id AS id_etapa,
    ae.kit_bap,
    ae.alca,
    ae.placa_way,
    ae.aspiral,
    ae.espinagem,
    ae.coordenada AS coordenada_etapa

FROM Acompanhamentos AS ac
LEFT JOIN usuarios AS us ON ac.user_id = us.id
LEFT JOIN fibras AS fb ON ac.tipo_fibra_id = fb.id
LEFT JOIN acompanhamento_etapas AS ae ON ac.id = ae.id_acompanhamento;

            `);

            // Corrige BigInt + Datas em TUDO
            const cleaned = fixDates(fixBigInts(data));

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Acompanhamentos");

            worksheet.columns = Object.keys(cleaned[0] ?? {}).map(key => ({
                header: key.toUpperCase(),
                key,
                width: 30
            }));

            cleaned.forEach(row => worksheet.addRow(row));

            worksheet.columns.forEach((column: any) => {
                let maxLength = 10;
                column.eachCell?.({ includeEmpty: true }, (cell: any) => {
                    const value = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, value.length);
                });
                column.width = maxLength + 2;
            });

            const fileName = `acompanhamentos_${Date.now()}.xlsx`;

            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: true, message: "Erro ao gerar Excel" });
        }
    }
}
