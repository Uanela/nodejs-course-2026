import http from "http";

// Criando o servidor http
const server = http.createServer((req, res) => {
  // Metódos HTTP
  // GET - Buscar/Ler/Pegar
  // POST - Criar
  // PUT - Atualizar todos os campos
  // PATCH - Atualizar parcial
  // DELETE - Apagar recurso

  // Rotas
  // /produtos
  // /usuarios

  res.writeHead(200, { "Content-type": "application/json" });
  res.end(`{
    "firstName": "Uanela",
    "lastName": "Como",
    "age": "45",
    "country: "Moçambique"
    }`);
});

const PORT = 3001;

// Configurando para escutar requisições na porta 3000
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
