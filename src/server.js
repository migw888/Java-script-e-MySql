import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import path from "path";    
import { fileURLToPath } from "url"; 
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./doc/swagger-output.json" with {type: "json"}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 3000;

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: process.env.DB_WFC,
    connectionLimit: process.env.DB_CL,
    queueLimit: process.env.DB_QUEUELIMIT
})

app.post("/users", async (req, res) => {
    try {
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;

        const result = await pool.query(
            "INSERT INTO user (nome, email, cpf, apelido) values(?, ?, ?, ?);",
            [nome, email, cpf, apelido]
        )

        res.status(201).json({ msg: "Usuario criado com sucesso" })
    }
    catch (error) {
        console.log("erro ao criar usuario")
        res.status(500).json({ msg: "erro ao criar usuario" })
    }
})

app.get("/users", async (req, res) => {
    try {
        const rows = await pool.query("SELECT * FROM user;");
        res.status(200).json(rows[0])
    }
    catch (erro) {
        console.error("erro ao listar usuario")
        res.status(500).json({ msg: "Erro ao listar usuario" })
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await pool.query(
            "DELETE FROM user WHERE id = ?",
            [id]
        );
        
        if(rows[0].affectedRows == 0){
            throw new Error("Erro ao deletar usuario")
        }


        res.status(200).json({ msg: "Usuário deletado com sucesso" });
    }
    catch (erro) {
        console.log("erro ao deletar usuario")
        res.status(500).json({ msg: "erro ao deletar usuario" })
    }
})

app.put("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;

        const rows = await pool.query("UPDATEs user SET nome = ?, email = ?, apelido = ?, cpf = ?  WHERE id = ?",
            [nome, email, apelido, cpf, id])

        res.status(200).json({ msg: "usuario atualizado" });
    }
    catch (error) {
        console.log("erro ao atualizar o usuario")
        res.status(500).json({ msg: "erro ao atualizar o usuario" })
    }
});

app.listen(port, () => {
    console.log("Servidor rodando na porta 3000")
})
