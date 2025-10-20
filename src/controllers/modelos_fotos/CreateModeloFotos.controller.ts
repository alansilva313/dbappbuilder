import { prisma } from "../../config/client/PrismaClient";



export default class CreateModeloFotosController {


    async create(req: any, res: any){
        try {

            const { tipo, status} = req.body;

            if(!tipo || !status) return res.status(404).json({
                message: "Falha ao criar, dados necessários não enviados!"
            });


            const existModeloImagem = await prisma.modelosImagens.findFirst({
                where: {
                    tipo: tipo
                }
            });

            if(existModeloImagem) return res.status(400).json({
                message: "Tipo de imagem já cadastrado!"
            });


            const result: any = await prisma.modelosImagens.create({
                data: {
                    tipo: tipo,
                    status: status
                }
            });


            if(!result) return res.status(404).json({
                message: "Falha ao criar modelo de imagem!"
            });



            return res.status(200).json({
                message: "Modelo de imagem criado com sucesso",
                result: result
            })


          

            
        } catch (error) {
            console.log(error)
        }
    }
}