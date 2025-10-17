import { prisma } from "../../config/client/PrismaClient"



export default class CreateFibrasController {


    async create(req: any, res: any){

        const { tipo } =  req.body;

        if(!tipo) res.status(404).json({
            message: "Tipo é obrigatorio!"
        })

        try {


            const fibraAllReadyExist = await prisma.fibras.findFirst({
                where: {
                    tipo: "F"+tipo
                }
            });


            if(fibraAllReadyExist) return res.status(200).json({
                message: "Modelo de fibra já existe, cadastre outro!"
            })

            const result: any = await prisma.fibras.create({
                data: {
                    tipo: "F"+tipo,
                    status: true
                }
            });


            if(!result) res.status(404).json({ message: "Falha ao criar modelo de fibra!"});


            res.status(200).json({
                message: "Modelo de fibra cadastrado com suceso!",
                result: result.data
            })
            
        } catch (error) {
            
            console.log(error)
        }
    }
}