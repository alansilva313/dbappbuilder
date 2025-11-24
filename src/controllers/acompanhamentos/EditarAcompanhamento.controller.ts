import { prisma } from "../../config/client/PrismaClient";


export default class EditarAcompanhamentoController {


    async edit(req: any, res: any){

        const { id_acompanhamento, protocolo} = req.body;
        try {


            if(!id_acompanhamento || !protocolo) return res.status(404).json({
                message: "Parametro não enviado!"
            })

            const allreadyExist: any = await prisma.acompanhamentos.findFirst({
                where: {
                    id: id_acompanhamento
                }
            });

            if(!allreadyExist) return res.status(404).json({
                message: "Registro não encontrado!"
            })

            const result: any = await prisma.acompanhamentos.updateMany({
                where: {
                    id: id_acompanhamento
                },
                data: {
                    protocolo: protocolo
                }
            });


            if(!result) return res.status(400).json({
                message: "Falha ao editar Acompanhamento"
            });



            return res.status(200).json({
                message: "Acompanhamento editado com sucesso!"
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}