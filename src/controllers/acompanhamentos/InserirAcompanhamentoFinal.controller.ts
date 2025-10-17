import { prisma } from "../../config/client/PrismaClient"
import { getDataLocal } from "../../utils/dataLocal";


export default class InserirAcompanhamentoFinalController {


    async final(req: any, res: any){
         
        const { id_acompanhamento, metragem_final, coordenada_final } = req.body;
        try {

            const result: any = await prisma.acompanhamentos.update({
                data: {
                    data_fim: getDataLocal(),
                    hora_fim: getDataLocal(),
                    coordenada_final: JSON.parse(coordenada_final),
                    metragem_final
                    
                },
                where: {
                    id: id_acompanhamento
                }
            });


            if(!result) return res.status(404).json({
                message: "Falha ao inserir acompanhamento final!"
            });


            return res.status(201).json({
                message: "Acompanhamento final inserido com sucesso",
                acompanhamento_final: result
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}