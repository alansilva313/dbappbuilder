
import { prisma } from "../../config/client/PrismaClient";
import path from "path";

export default class SalvarImagensController {
  async salvar(req: any, res: any) {
    try {
      const { id_acompanhamento, modelo_foto_id, tipo_foto } = req.body;
      const files = req.files as Express.Multer.File[];
      

      // 🔹 Verifica se foram enviadas imagens
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Nenhuma imagem enviada!" });
      }

      // 🔹 Mapeia apenas os caminhos das imagens
      const imagensArray = files.map((file) => `/uploads/${file.filename}`);

      // 🔹 Insere uma única linha no banco com array JSON no campo 'imagem'
      const result = await prisma.acompanhamentoFotos.create({
        data: {
          id_acompanhamento: id_acompanhamento,
          modelo_foto_id,
          tipo_foto,
          imagem: imagensArray, // <-- campo JSON recebe array
        },
      });

      return res.status(201).json({
        message: `${files.length} imagem(ns) salva(s) com sucesso!`,
        imagens: imagensArray,
      });
    } catch (error) {
      console.error("Erro ao salvar imagens:", error);
      return res.status(500).json({
        message: "Erro interno ao salvar imagens.",
        error: (error as Error).message,
      });
    }
  }
}
