import { prisma } from "../../config/client/PrismaClient"


export default class ListarUsuariosController {



    async listar(req: any, res: any){


        try {

            const result: any = await prisma.users.findMany({
                omit: {
                    senha: true
                }
            });



            return res.status(200).json({
                message: "listando usuarios",
                data: result
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}