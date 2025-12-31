import dotenv from "dotenv";
dotenv.config({ quiet: true });

import http from "http";
import chalk from "chalk";
import db from "./db/index.js";

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
  return url.split("/")[3];
}

// Helper function para encontrar por ID
function findById(id) {
  return database.carros.find((c) => c.id === id);
}

// Criando o servidor http
const server = http.createServer(async (req, res) => {
  let { method, url } = req;
  url = decodeURIComponent(url);
  // Headers
  let statusCode = 200;
  let contentType = "application/json";

  // Response body
  let responseBody = { mensagem: "Rota não encontrada" };

  try {
    if (method === "GET") {
      // GET /api/produtos - Retona a lista de produtos
      if (url === "/api/produtos") {
        responseBody = { produtos: database.produtos };
        // GET /api/cars - Retona a lista de carros
      } else if (url === "/api/cars") {
        const result =
          await db.query(`SELECT cars.*, brands.name AS brand__name, brands.created_at AS brand__created_at FROM cars 
          JOIN brands ON cars.brand_id = brands.id`);

        responseBody = { cars: result.rows };

        // GET /api/cars/:id - Buscar um carro atráves do ID
      } else if (url.startsWith("/api/cars/")) {
        const id = extractId(url);
        const result = await db.query(
          `SELECT cars.*, brands.name AS brand__name, brands.created_at AS brand__created_at FROM cars 
          JOIN brands ON cars.brand_id = brands.id WHERE cars.id = $1`,
          [id]
        );
        const car = result.rows[0];

        if (car) {
          responseBody = { car };
        } else {
          statusCode = 404;
          responseBody = { mensagem: `Carro com id ${id} não encontrado.` };
        }
      }

      // POST /api/cars - Criar novo carro
    } else if (method === "POST") {
      if (url === "/api/cars") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          const data = JSON.parse(body);
          const query = `INSERT INTO cars 
          (price, model, color, transmission_type, release_year, brand_id)
          VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *
          `;

          const result = await db.query(query, [
            data.price,
            data.model,
            data.color,
            data.transmission_type,
            data.release_year,
            data.brand_id,
          ]);

          responseBody = { car: result.rows[0] };
          statusCode = 201;

          // Definindo o tipo de resposta (usando header) que será enviado
          res.writeHead(statusCode, { "Content-type": contentType });
          res.end(JSON.stringify(responseBody));
        });
      }
    } else if (method === "PATCH") {
      if (url.startsWith("/api/cars/")) {
        const id = extractId(url);

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          const data = JSON.parse(body);

          const result = await db.query(
            `UPDATE cars SET ${Object.keys(data)
              .map((key, i) => `${key} = $${i + 1}`)
              .join(", ")} WHERE id = ${id} RETURNING *`,
            Object.values(data)
          );

          if (!result.rows[0]) {
            statusCode = 404;
            responseBody = {
              mensagem: `Carro com id ${id} não encontrado para poder atualizar.`,
            };
          } else {
            responseBody = { car: result.rows[0] };
            statusCode = 200;
          }

          // Definindo o tipo de resposta (usando header) que será enviado
          res.writeHead(statusCode, { "Content-type": contentType });
          res.end(JSON.stringify(responseBody));
        });
      }
    } else if (method === "DELETE") {
      if (url.startsWith("/api/cars/")) {
        const id = extractId(url);
        const query = `DELETE FROM  cars WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);

        if (result.rows[0]) {
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
  } catch (error) {
    responseBody = {
      message: error.message,
      stack: error.stack.split("\n"),
      error,
    };
    statusCode = 500;
  }

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
