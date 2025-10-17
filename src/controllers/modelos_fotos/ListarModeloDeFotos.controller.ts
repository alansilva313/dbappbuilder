import { prisma } from "../../config/client/PrismaClient"



export default class ListarModeloDeFotosController {

    async read(req: any, res: any){

        try {

            const result: any = await prisma.modelosImagens.findMany();


            return res.status(200).json({
                message: "Listando modelo de imagens",
                result: result
            })
            
        } catch (error) {
            console.log(`Falha ao ler fibras ${error}`)
        }
    }
}