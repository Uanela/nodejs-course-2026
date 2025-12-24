import http from "http";

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
      const id = Number(url.split("/")[3]);
      const carro = database.carros.find((c) => c.id === id);

      if (carro) {
        responseBody = { carro };
      } else {
        statusCode = 404;
        responseBody = { mensagem: `Carro com id ${id} não encontrado.` };
      }
    }
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
        res.end(JSON.striœngify(responseBody));
      });
    }
  }

  if (responseBody?.mensagem === "Rota não encontrada") statusCode = 404;

  if (!["POST", "PUT", "PATCH"].includes(method)) {
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
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
