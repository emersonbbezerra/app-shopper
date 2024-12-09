# Shopper Transport Application

## Descrição

Este projeto é uma aplicação de transporte particular desenvolvida como parte do teste técnico para a vaga de desenvolvedor na Shopper.com.br. A aplicação permite que os usuários solicitem uma viagem de um ponto A até um ponto B, escolham entre diferentes motoristas e confirmem a viagem. Além disso, os usuários podem visualizar o histórico de suas viagens.

## Funcionalidades

- **Solicitação de Viagem**: O usuário pode informar seu ID, endereço de origem e destino para estimar o valor da viagem.
- **Opções de Motoristas**: Após a estimativa, o usuário pode visualizar um mapa com a rota e uma lista de motoristas disponíveis, incluindo detalhes como nome, descrição, veículo, avaliação e valor da viagem.
- **Confirmação de Viagem**: O usuário pode escolher um motorista e confirmar a viagem, que será registrada no histórico.
- **Histórico de Viagens**: O usuário pode consultar suas viagens anteriores, filtrando por motorista.

## Tecnologias Utilizadas

- **Backend**: Node.js, TypeScript, Express
- **Frontend**: React, TypeScript, Material-UI
- **Banco de Dados**: MongoDB
- **API de Mapas**: Google Maps API
- **Docker**: Para containerização da aplicação

## Estrutura do Projeto

```bash
app-shopper/
├── backend/                # Código-fonte do backend
│   ├── src/                
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── exceptions/
│   │   ├── interfaces/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/               # Código-fonte do frontend
    ├── src/                
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── theme.ts
    ├── package.json
    ├── Dockerfile
    └── .env.example
```


## Instruções de Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [Docker](https://www.docker.com/get-started)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou usar o MongoDB em um container)

### Configuração do Ambiente
1. Clone o repositório:
    ```bash
    git clone https://github.com/emersonbbezerra/app-shopper.git
    cd app-shopper
    ```

2. Crie um arquivo `.env` na raiz do diretório backend com a seguinte variável:
    ```plaintext
    GOOGLE_API_KEY=<sua_chave_da_api>
    ```

3. Navegue até o diretório backend e instale as dependências:
    ```bash
    cd backend
    npm install
    ```

4. Navegue até o diretório frontend e instale as dependências:
    ```bash
    cd ../frontend
    npm install
    ```

---

### Execução da Aplicação
No diretório raiz do projeto, execute o seguinte comando para iniciar os serviços:
```bash
docker-compose up
```

A aplicação estará disponível em:

* Backend: http://localhost:8080
* Frontend: http://localhost

## Testando os Endpoints

1. Estimar Viagem
* Endpoint: POST /ride/estimate

#### Request Body:

```json
{
  "customer_id": "string",
  "origin": "string",
  "destination": "string"
}
```

#### Response:
```bash
200: Operação realizada com sucesso
```
```bash
400: Dados inválidos
```

2. Confirmar Viagem
* Endpoint: PATCH /ride/confirm

#### Request Body:

```json
{
  "customer_id": "string",
  "origin": "string",
  "destination": "string",
  "distance": number,
  "duration": "string",
  "driver": {
    "id": number,
    "name": "string"
  },
  "value": number
}
```

#### Response:

```bash
200: Operação realizada com sucesso
```
```bash
400: Dados inválidos
```
```bash
404: Motorista não encontrado
```
```bash
406: Quilometragem inválida
```

3. Listar Histórico de Viagens
* Endpoint: GET /ride/{customer_id}?driver_id={id}

#### Response:

```bash
200: Operação realizada com sucesso
```
```bash
400: Motorista inválido
```
```bash
404: Nenhum registro encontrado
```

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [MIT License](LICENSE) para mais detalhes.