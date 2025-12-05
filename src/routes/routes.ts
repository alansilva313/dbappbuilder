import { Router } from "express";
import CreateFibrasController from "../controllers/fibras/CreateFibras.controller";
import ReadAllFibrasController from "../controllers/fibras/ReadAllFibras.controller";
import CreateModeloFotosController from "../controllers/modelos_fotos/CreateModeloFotos.controller";
import CreateUserController from "../controllers/users/CreateUser.controller";
import AutenticarController from "../controllers/auth/AutenticarController";
import InserirAcompanhamentoInicialController from "../controllers/acompanhamentos/InserirAcompanhamentoInicial.controller";
import InserirAcompanhamentoPontosController from "../controllers/acompanhamentos/InserirAcompanhamentoPontos.controller";
import InserirAcompanhamentoFinalController from "../controllers/acompanhamentos/InserirAcompanhamentoFinal.controller";

import SalvarImagensController from "../controllers/acompanhamentos/SalvarImagens.controller";
import { upload } from "../config/multer/MulterConfig";
import ListarModeloDeFotosController from "../controllers/modelos_fotos/ListarModeloDeFotos.controller";
import AcompanhamentoPorTecnicoController from "../controllers/acompanhamentos/AcompanhamentoPorTecnico.controller";
import ListarAcompanhamentoController from "../controllers/acompanhamentos/ListarAcompanhamento.controller";
import ListarUsuariosController from "../controllers/users/ListarUsuarios.controller";
import AcompanhamentosGeralController from "../controllers/acompanhamentos/AcompanhamentosGeral.controller";
import UpdateUserController from "../controllers/users/EditarUsuario.controller";
import path from "path";
import fs from "fs";
import MetragemPorFibraKpi from "../controllers/kpis/MetragemPorFibra.kpi";
import EditarAcompanhamentoController from "../controllers/acompanhamentos/EditarAcompanhamento.controller";
import ExportData from "../controllers/kpis/exportarPlanilha";
import PendenciasGeral from "../controllers/kpis/pendenciasGeral";
import PostesPorTecnico from "../controllers/kpis/postesPortTecnico";

const router = Router();


const createFibrasController = new CreateFibrasController();
const readAllFibrasController = new ReadAllFibrasController();
const createModeloFotosController = new CreateModeloFotosController();
const listarModeloDeFotosController = new ListarModeloDeFotosController();

const createUserController = new CreateUserController();

const autenticarController = new AutenticarController();

const inserirAcompanhamentoInicialController = new InserirAcompanhamentoInicialController();
const listarAcompanhamentoController = new ListarAcompanhamentoController();

const inserirAcompanhamentoPontosController = new InserirAcompanhamentoPontosController();
const inserirAcompanhamentoFinalController = new InserirAcompanhamentoFinalController();

const updateUserController = new UpdateUserController();
const listarUsuariosController = new ListarUsuariosController();
const acompanhamentoPorTecnicoController = new AcompanhamentoPorTecnicoController();
const acompanhamentosGeralController = new AcompanhamentosGeralController();
const salvarImagensController = new SalvarImagensController();

const editarAcompanhamentoController = new EditarAcompanhamentoController();
const exportData = new ExportData();

const pendenciasGeral = new PendenciasGeral();


const postesPorTecnico = new PostesPorTecnico();


/* KPIS */


const metragemPorFibraKpi = new MetragemPorFibraKpi();



router.get("/kpi/metragem", metragemPorFibraKpi.metric);

router.get("/kpi/dados", pendenciasGeral.pd);
router.get("/kpi/poste/tecnicos", postesPorTecnico.buscar)





router.get("/", (req, res) => {
    res.status(200).json({
        message: "Rota barra do app de checagem"
    })
});



router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../donwloadapp", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Arquivo não encontrado" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Erro ao enviar o arquivo:", err);
      res.status(500).json({ error: "Erro ao baixar o arquivo" });
    }
  });
});

router.post("/auth", autenticarController.auth.bind(new AutenticarController()))

router.post("/users", createUserController.create.bind(new CreateUserController()))
router.get("/users", listarUsuariosController.listar);
router.put('/users/:id', updateUserController.update.bind(updateUserController));

router.post("/fibras", createFibrasController.create.bind(new CreateFibrasController()));
router.get("/fibras", readAllFibrasController.read);


router.post("/modelo/imagens", createModeloFotosController.create.bind(new CreateModeloFotosController()));
router.get("/modelo/imagens", listarModeloDeFotosController.read);


router.get("/export/data", exportData.export);


router.post("/acompanhamento", inserirAcompanhamentoInicialController.acompanhamento.bind(new InserirAcompanhamentoInicialController()));
router.get("/acompanhamento", listarAcompanhamentoController.listar);
router.get("/acompanhamento/geral", acompanhamentosGeralController.listar);
router.post("/acompanhamento/etapas", inserirAcompanhamentoPontosController.pontos.bind(new InserirAcompanhamentoPontosController()));
router.put("/acompanhamento/final", inserirAcompanhamentoFinalController.final.bind(new InserirAcompanhamentoFinalController()));
router.put("/acompanhamento", editarAcompanhamentoController.edit);

router.get("/acompanhamento/tecnico", acompanhamentoPorTecnicoController.listar);

router.post(
  "/acompanhamento/imagem",
  upload.array("imagem", 10),
  salvarImagensController.salvar.bind(new SalvarImagensController())
);



export default router;






