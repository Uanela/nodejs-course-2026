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
  produtos: ["Samsung S30 Ultra", "Macbook M20", "Playstation 10"],
};

// Criando o servidor http
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Definindo o tipo de resposta que será enviado
  res.writeHead(200, { "Content-type": "application/json" });

  // Fazendo log de dados da requisição
  console.log(req.method, new Date(Date.now()).toLocaleTimeString(), req.url);

  if (method === "GET") {
    if (url === "/api/produtos") {
      return res.end(`{ "produtos": ["Produto 1", "Produto 2"] }`);
    } else if (url === "/api/carros") {
      return res.end(`{ "carros": ["Toyota", "Tesla", "Ferrari"] }`);
    }
  }

  res.end(`{ mensagem: "Rota não encontrada!" }`);
});

const PORT = 3001;

// Configurando para escutar requisições na porta 3000
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
