import dotenv from "dotenv";

dotenv.config();

import http from "http";
import chalk from "chalk";
import db from "./db/index.js";

console.log(db);

// const http = require("http");

// Metódos HTTP
// GET - Buscar/Ler/Pegar
// POST - Criar
// PUT - Atualizar todos os campos
// PATCH - Atualizar parcial
// DELETE - Apagar recurso

// Rotas
// /produtos
// /usuarios

const database = {
  produtos: [
    { id: 1, nome: "Samsung S30 Ultra", preco: 180 },
    { id: 2, nome: "Macbook M20", preco: 299 },
    { id: 3, nome: "Playstation 10", preco: 100 },
  ],
  carros: [
    { id: 1, nome: "Toyota Corolla", modelo: "XEi 2.0", preco: 120 },
    { id: 2, nome: "Honda Civic", modelo: "Touring 1.5 Turbo", preco: 150 },
    { id: 3, nome: "Volkswagen Jetta", modelo: "GLI 2.0 TSI", preco: 135 },
  ],
};

// Helper function para extrair ID≈
function extractId(url) {
  return Number(url.split("/")[3]);
}

// Helper function para encontrar por ID
function findById(id) {
  return database.carros.find((c) => c.id === id);
}

// Criando o servidor http
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Headers
  let statusCode = 200;
  let contentType = "application/json";

  // Response body
  let responseBody = { mensagem: "Rota não encontrada" };

  if (method === "GET") {
    // GET /api/produtos - Retona a lista de produtos
    if (url === "/api/produtos") {
      responseBody = { produtos: database.produtos };
      // GET /api/carros - Retona a lista de carros
    } else if (url === "/api/carros") {
      responseBody = { carros: database.carros };

      // GET /api/carros/:id - Buscar um carro atráves do ID
    } else if (url.startsWith("/api/carros/")) {
      const id = extractId(url);
      const carro = findById(id);

      if (carro) {
        responseBody = { carro };
      } else {
        statusCode = 404;
        responseBody = { mensagem: `Carro com id ${id} não encontrado.` };
      }
    }

    // POST /api/carros - Criar novo carro
  } else if (method === "POST") {
    if (url === "/api/carros") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const data = JSON.parse(body);
        data.id = database.carros.length + 1;

        database.carros.push(data);

        responseBody = { carro: data };
        statusCode = 201;

        // Definindo o tipo de resposta (usando header) que será enviado
        res.writeHead(statusCode, { "Content-type": contentType });
        res.end(JSON.stringify(responseBody));
      });
    }
  } else if (method === "PATCH") {
    if (url.startsWith("/api/carros/")) {
      const id = extractId(url);
      let carro = findById(id);

      if (carro) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const data = JSON.parse(body);
          carro = { ...carro, ...data };

          database.carros = database.carros.map((c) => {
            if (c.id === id) return { ...c, ...carro };
            return c;
          });

          responseBody = { carro };
          statusCode = 200;

          // Definindo o tipo de resposta (usando header) que será enviado
          res.writeHead(statusCode, { "Content-type": contentType });
          res.end(JSON.stringify(responseBody));
        });
      } else {
        statusCode = 404;
        responseBody = {
          mensagem: `Carro com id ${id} não encontrado para poder atualizar.`,
        };

        res.writeHead(statusCode, { "Content-type": contentType });
        res.end(JSON.stringify(responseBody));
      }
    }
  } else if (method === "DELETE") {
    if (url.startsWith("/api/carros/")) {
      const id = extractId(url);
      let carro = findById(id);
      if (carro) {
        database.carros = database.carros.filter((c) => {
          if (c.id !== id) return c;
        });
        statusCode = 204;
        responseBody = null;
      } else {
        statusCode = 404;
        responseBody = {
          mensagem: `Carro com id ${id} não encontrado para poder deletar.`,
        };
      }
    }
  }

  if (responseBody?.mensagem === "Rota não encontrada") statusCode = 404;

  if (!["POST", "PATCH"].includes(method)) {
    // Definindo o tipo de resposta (usando header) que será enviado
    res.writeHead(statusCode, { "Content-type": contentType });
    res.end(JSON.stringify(responseBody));
  }

  // Fazendo log de dados da requisição
  console.log(
    req.method,
    new Date(Date.now()).toLocaleTimeString(),
    req.url,
    statusCode
  );
});

const PORT = 3001;

// Configurando para escutar requisições na porta 3000
server.listen(PORT, () => {
  console.log(
    `[${chalk.green("Ready")}] Servidor rodando em http://localhost:${PORT}`
  );
});

// uanelaluiswayne@gmail.com
