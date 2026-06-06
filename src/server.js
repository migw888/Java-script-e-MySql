import express from "express";
import mysql from "mysql2/promise";

const port = 3000;
const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost", 
    user: "root",
    password: "1234",
    database: "user_db",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.post("/users", async (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const apelido = req.body.apelido ?? null;

    const result = await pool.query(
        "INSERT INTO user (nome, email, cpf, apelido) values(?, ?, ?, ?);",
        [nome, email, cpf, apelido]
    )

    res.status(201).json({msg: "Usuario criado com sucesso"})
})

app.get("/users", async (req, res) => {
    const rows = await pool.query("SELECT * FROM user;");
    res.status(200).json(rows[0])
})

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;

        const [result] = await pool.query(
        "DELETE FROM user WHERE id = ?",
        [id]
    );


    res.status(200).json({ msg: "Usuário deletado com sucesso" });
})

app.put("/users/:id", async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const apelido = req.body.apelido ?? null;

    const rows = await pool.query("UPDATE user SET nome = ?, email = ?, apelido = ?, cpf = ?  WHERE id = ?",
    [nome, email, apelido, cpf, id])

    res.status(200).json({msg: "usuario atualizado"});
});

app.listen(port, () => {
    console.log("Servidor rodando na porta 3000")
})
