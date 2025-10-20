import { prisma } from "../../config/client/PrismaClient";


export default class InserirAcompanhamentoPontosController {


    async pontos(req: any, res: any){

        const { id_acompanhamento, kit_bap, alca, placa_way, aspiral, espinagem, visual, elegivel_sobra, sobra_padrao, coordenada} = req.body;
         
        try {


            const result: any = await prisma.acompanhamentoEtapas.create({
                data: {
                    id_acompanhamento,
                    kit_bap,
                    alca,
                    placa_way,
                    aspiral,
                    espinagem,
                    elegivel_sobra,
                    sobra_padrao,
                    coordenada: JSON.parse(coordenada)


                }
            });


            if(!result) return res.status(400).json({
                message: "Falha ao inserir etapas"
            });



            return res.status(201).json({
                message: "Etapas inserida com sucesso!",
                etapas: result
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}