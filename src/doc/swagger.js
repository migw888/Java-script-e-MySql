import "dotenv/config";
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "minha API",
        description: "Uma simples API para gerenciamento de usuarios"
    },
    host: "localhost" + process.env.SERVER_PORT,
    scremes: ["http"]
};

const outputfile = "./swagger-output.json";
const route = [".src/server/js"];
swaggerAutogen()(outputfile, route, doc)