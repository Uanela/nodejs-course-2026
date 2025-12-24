import http from "http";

// Criando o servidor http
const server = http.createServer((req, res) => {
  const obj = {
    name: "Uanela",
    age: "40",
    country: "Moçambique",
  };

  // JSON - JavaScript Object Notation

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
