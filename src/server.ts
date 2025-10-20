require("dotenv").config();

import express from 'express';
import router from './routes/routes';
import cors from 'cors';
import path from 'path';
const app = express();
const PORT = process.env.PORT;




app.use(cors());
app.use(express.json());


app.use("/check/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/check/donwloadapp", express.static(path.resolve(__dirname, "donwloadapp")));
app.use("/check", router)





app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`)
})