import http from "http";

// Criando o servidor http
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("Hello World!");
});

// Configurando para escutar requisições na porta 3000
server.listen(3000, () => {
  console.log(`Servidor rodando em http://localhost:3000`);
});
