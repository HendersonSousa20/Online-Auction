# 🛍️ Online Auction 🎉

Este é um projeto de leilão online desenvolvido em Node.js. Permite que os usuários façam lances em um item de leilão específico durante um período de tempo determinado.

## Funcionalidades

- 👥 Os usuários podem fazer lances em um item de leilão.
- 📈 O sistema rastreia o lance mais alto e o nome do maior licitante.
- ⏳ Um temporizador é exibido para mostrar o tempo restante do leilão.
- 📜 Uma lista de lances é mantida e exibida durante o leilão.
- 🔄 O leilão é reiniciado automaticamente após o término.

## Pré-requisitos

- Node.js instalado na máquina local.

## Instalação

1. Clone o repositório para o seu ambiente local:

    ```bash
    git clone https://github.com/HendersonSousa20/online-auction.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd online-auction
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

## Uso

1. Inicie o servidor:

    ```bash
    node server.js
    ```

2. Abra um navegador da web e acesse `http://localhost:3000` para ver a página do leilão.

3. Para fazer um lance, insira seu nome e o valor do lance nos campos fornecidos e clique no botão "Place Bid".

## Rotas da API

- **GET /status**: Retorna o estado atual do leilão, incluindo o valor do lance atual, o maior licitante, o tempo restante do leilão e a lista de lances.

- **POST /update**: Permite que os usuários façam lances no item de leilão. Deve incluir o nome do licitante e o valor do lance no corpo da solicitação.

- **POST /reset**: Reinicia o leilão, limpando o estado atual e reiniciando o temporizador.

## Contribuindo

Contribuições são bem-vindas! Se você encontrar um problema ou tiver alguma ideia de melhoria, sinta-se à vontade para abrir uma issue ou enviar um pull request. Certifique-se de seguir as diretrizes de contribuição.

## Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Consulte o arquivo LICENSE para obter mais detalhes.
