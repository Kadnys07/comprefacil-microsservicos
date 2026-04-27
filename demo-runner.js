const { spawn } = require('child_process');
const http = require('http');

console.log('Iniciando ms-pagamento na porta 3000...');
const pagamento = spawn('npm', ['run', 'start'], { cwd: './ms-pagamento', shell: true });

console.log('Iniciando ms-notificacao...');
const notificacao = spawn('npm', ['run', 'start'], { cwd: './ms-notificacao', shell: true });

let output = '';

pagamento.stdout.on('data', data => {
  const text = data.toString();
  if (text.includes('LOG')) output += `[PAGAMENTO] ${text.trim()}\n`;
});
notificacao.stdout.on('data', data => {
  const text = data.toString();
  if (text.includes('LOG') || text.includes('=')) output += `[NOTIFICACAO] ${text.trim()}\n`;
});

pagamento.stderr.on('data', data => output += `[ERRO PAGAMENTO] ${data.toString()}\n`);
notificacao.stderr.on('data', data => output += `[ERRO NOTIFICACAO] ${data.toString()}\n`);

setTimeout(() => {
  console.log('Serviços iniciados! Enviando requisição de pagamento (R$ 299.90)...');
  const data = JSON.stringify({
    usuarioId: "cliente-teste-456",
    valor: 299.90,
    descricao: "Compra de teste via Antigravity"
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/pagamento',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }, (res) => {
    let resData = '';
    res.on('data', d => resData += d);
    res.on('end', () => {
        output += `\n[CLIENTE] Resposta da API: ${resData}\n\n`;
    });
    
    // Aguarda o processamento assíncrono do RabbitMQ
    setTimeout(() => {
      pagamento.kill();
      notificacao.kill();
      console.log('\n' + '='.repeat(60));
      console.log(' RESULTADO DA COMUNICAÇÃO DISTRIBUÍDA VIA RABBITMQ (NUVEM)');
      console.log('='.repeat(60) + '\n');
      console.log(output);
      process.exit(0);
    }, 8000);
  });
  
  req.on('error', e => console.error('Erro na requisição:', e.message));
  req.write(data);
  req.end();
}, 20000); // Aguarda 20 segundos para inicialização
