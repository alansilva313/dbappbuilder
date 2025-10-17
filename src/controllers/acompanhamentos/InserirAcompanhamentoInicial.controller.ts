import { prisma } from "../../config/client/PrismaClient"
import { getDataLocal } from "../../utils/dataLocal";



export default class InserirAcompanhamentoInicialController {


    async acompanhamento(req: any, res: any){

        const { 
            user_id,
            coordenada_inicial,
            protocolo,
            tipo_fibra_id,
            metragem_inicial
        } = req.body;

        try {


            const result: any = await prisma.acompanhamentos.create({
                data: {
                    user_id,
                    data_inicio: getDataLocal(),
                    hora_inicio: getDataLocal(),
                    coordenada_inicial: JSON.parse(coordenada_inicial),
                    protocolo: protocolo ?? "",
                    tipo_fibra_id: tipo_fibra_id,
                    metragem_inicial: metragem_inicial



                }
            });


            if(!result) return res.status(404).json({
                message: "Ocorreu um erro ao inserir acompanhamento inicial!"
            })






            return res.status(201).json({
                message: "Acompanhamento inicial inserido com sucesso!",
                acompanhamento: result
            })
            
        } catch (error) {
            
            console.log(error)
        }
    }

}