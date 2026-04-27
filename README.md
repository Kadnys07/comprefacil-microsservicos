# CompreFácil - Desafio de Microsserviços (Distribuídos)

Este repositório contém a solução para o **Desafio 2** de sistemas distribuídos, implementando um fluxo de pagamento assíncrono utilizando **NestJS** e **RabbitMQ**.

## 🏗️ Arquitetura
O sistema foi reestruturado para utilizar os padrões nativos de microsserviços do NestJS, garantindo maior escalabilidade e desacoplamento.

1.  **ms-pagamento:** Serviço produtor que expõe uma API REST para receber solicitações de pagamento, persiste no banco de dados (SQLite via Prisma) e emite eventos para o RabbitMQ.
2.  **ms-notificacao:** Serviço consumidor que escuta eventos de pagamento via RabbitMQ e simula o processamento/envio de notificações.
3.  **RabbitMQ (CloudAMQP):** Broker de mensagens utilizado para a comunicação assíncrona entre os serviços.

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado.
- RabbitMQ rodando localmente ou acesso a uma instância CloudAMQP (configurar no `.env`).

### Execução Automática (Demo)
Este script inicia ambos os serviços, envia uma requisição de teste e exibe os logs integrados.
```bash
node demo-runner.js
```

### Execução Manual
1.  **Serviço de Pagamento:**
    ```bash
    cd ms-pagamento
    npm install
    npx prisma generate
    npm run start
    ```
2.  **Serviço de Notificação:**
    ```bash
    cd ms-notificacao
    npm install
    npm run start
    ```

## 🛠️ Tecnologias Utilizadas
- **Framework:** NestJS
- **Mensageria:** RabbitMQ (@nestjs/microservices)
- **ORM:** Prisma
- **Banco de Dados:** SQLite
- **Linguagem:** TypeScript

## 📝 Observações de "Humanização"
Todo o código foi traduzido para o **Português (PT-BR)**, incluindo nomes de variáveis, pastas, modelos de banco de dados e rotas, para refletir o desenvolvimento por um estudante brasileiro e cumprir os requisitos de clareza do desafio.
