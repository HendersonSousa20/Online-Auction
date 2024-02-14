const http = require('http');
const fs = require('fs');
const readline = require('readline');

// Definindo o leilão
let currentBid = 0;
let highestBidder = '';
let auctionEndTime = new Date().getTime() + 30000; // 30 segundos a partir do momento em que o servidor é iniciado
let bids = []; // Lista de lances

// Função para atualizar o valor do lance atual
function updateCurrentBid(amount) {
    currentBid = amount;
}

// Função para atualizar o nome do maior licitante
function updateHighestBidder(name) {
    highestBidder = name;
}

// Função para atualizar o tempo restante do leilão
function updateAuctionTimeRemaining() {
    const now = new Date().getTime();
    const timeRemaining = auctionEndTime - now;

    if (timeRemaining <= 0) {
        clearInterval(auctionTimer);
        return `Auction ended. The winner is: ${highestBidder}`;
    } else {
        return `Time Remaining: ${Math.floor(timeRemaining / 1000)}s`;
    }
}

// Função para reiniciar o leilão
function resetAuction() {
    currentBid = 0;
    highestBidder = '';
    bids = [];
    auctionEndTime = new Date().getTime() + 30000; // Reinicia o temporizador para mais 30 segundos
}

// Configuração da entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Solicitar a duração do leilão e a porta do servidor
rl.question('Enter auction duration (in seconds): ', (duration) => {
    auctionEndTime = new Date().getTime() + duration * 1000;

    rl.question('Enter server port number: ', (port) => {
        // Criando o servidor HTTP
        const server = http.createServer((req, res) => {
            // Rota raiz, retornando o HTML do leilão
            if (req.url === '/' || req.url === '/index.html') {
                fs.readFile('index.html', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    }
                });
            }

            // Rota para atualizar o estado do leilão
            else if (req.url === '/update') {
                const body = [];
                req.on('data', chunk => {
                    body.push(chunk);
                }).on('end', () => {
                    const requestData = Buffer.concat(body).toString();
                    const requestDataObject = JSON.parse(requestData);
                    const response = {};

                    if (requestDataObject.action === 'placeBid') {
                        const bidAmount = parseInt(requestDataObject.bidAmount);
                        const bidderName = requestDataObject.bidderName.trim();

                        if (bidderName === '') {
                            response.success = false;
                            response.message = 'Please enter your name.';
                        } else if (bidAmount <= currentBid) {
                            response.success = false;
                            response.message = 'Your bid must be higher than the current bid.';
                        } else {
                            updateCurrentBid(bidAmount);
                            updateHighestBidder(bidderName);
                            bids.push({ name: bidderName, amount: bidAmount });
                            response.success = true;
                            response.message = 'Bid placed successfully!';
                        }
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                });
            }

            // Rota para obter o estado do leilão
            else if (req.url === '/status') {
                const status = {
                    currentBid: currentBid,
                    highestBidder: highestBidder,
                    auctionTimeRemaining: updateAuctionTimeRemaining(),
                    bids: bids
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(status));
            }

            // Rota para reiniciar o leilão
            else if (req.url === '/reset') {
                resetAuction();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Auction reset.');
            }

            // Rota inválida
            else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        // Iniciando o servidor na porta especificada pelo usuário
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });

        // Atualizar o tempo restante do leilão a cada segundo
        const auctionTimer = setInterval(() => {
            if (auctionEndTime - new Date().getTime() <= 0) {
                clearInterval(auctionTimer);
            }
        }, 1000);

        rl.close(); // Fechar a interface de entrada do usuário após a configuração estar completa
    });
});
