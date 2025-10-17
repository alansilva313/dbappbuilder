import { prisma } from "../../config/client/PrismaClient"



export default class ReadAllFibrasController {

    async read(req: any, res: any){

        try {

            const result: any = await prisma.fibras.findMany();


            return res.status(200).json({
                message: "Listando modelo de fibras",
                result: result
            })
            
        } catch (error) {
            console.log(`Falha ao ler fibras ${error}`)
        }
    }
}