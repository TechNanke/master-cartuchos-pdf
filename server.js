const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Caminho da logo
const arquivoLogo = path.join(__dirname, 'logo.jpg');

app.use(cors());
app.use(express.json());

function dataHoraAtual() {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Recife',
  }).format(new Date());
}

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'API Master Cartuchos funcionando',
  });
});

app.post('/gerar-pdf', (req, res) => {

  const {
    nome,
    servico,
    detalhesCartucho,
    valor,
    valorExtenso,
    empresa,
    telefone,
  } = req.body;

  // Validação
  if (!nome || !servico || !valor || !valorExtenso || !empresa) {
    return res.status(400).send(
      'Preencha os campos obrigatórios.'
    );
  }

  const dataHora = dataHoraAtual();

  // Criação do PDF
  const pdf = new PDFDocument({
    size: 'A4',
    margin: 0,
  });

  // Resposta do PDF
  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename="recibo-master-cartuchos.pdf"'
  );

  pdf.pipe(res);

  /*
  ==================================================
  CORES DA EMPRESA
  ==================================================
  */

  const azul = '#155EEF';
  const azulEscuro = '#0B3B91';
  const cinza = '#667085';
  const cinzaClaro = '#F2F4F7';
  const preto = '#101828';
  const branco = '#FFFFFF';

  /*
  ==================================================
  FUNDO
  ==================================================
  */

  pdf
    .rect(0, 0, 595, 842)
    .fill(branco);

  /*
  ==================================================
  CABEÇALHO
  ==================================================
  */

  pdf
    .rect(0, 0, 595, 125)
    .fill(azulEscuro);

  /*
  ==================================================
  LOGO
  ==================================================
  */

  if (fs.existsSync(arquivoLogo)) {

    pdf.image(
      arquivoLogo,
      45,
      25,
      {
        fit: [110, 70],
        align: 'center',
        valign: 'center',
      }
    );

  }

  /*
  ==================================================
  NOME DA EMPRESA
  ==================================================
  */

  pdf
    .fillColor(branco)
    .font('Helvetica-Bold')
    .fontSize(20)
    .text(
      empresa,
      175,
      32,
      {
        width: 365,
        align: 'right',
      }
    );

  /*
  ==================================================
  TELEFONE
  ==================================================
  */

  pdf
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#D0D5DD')
    .text(
      telefone
        ? `Telefone: ${telefone}`
        : 'Recarga e serviços de cartuchos',
      175,
      62,
      {
        width: 365,
        align: 'right',
      }
    );

  /*
  ==================================================
  DATA
  ==================================================
  */

  pdf
    .fillColor(cinza)
    .font('Helvetica')
    .fontSize(10)
    .text(
      dataHora,
      400,
      147,
      {
        width: 150,
        align: 'right',
      }
    );

  /*
  ==================================================
  TÍTULO
  ==================================================
  */

  pdf
    .fillColor(preto)
    .font('Helvetica-Bold')
    .fontSize(25)
    .text(
      'RECIBO',
      45,
      190
    );

  // Linha azul abaixo do título
  pdf
    .fillColor(azul)
    .rect(45, 225, 55, 4)
    .fill();

  /*
  ==================================================
  CLIENTE
  ==================================================
  */

  pdf
    .fillColor(preto)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(
      'DADOS DO CLIENTE',
      45,
      270
    );

  pdf
    .roundedRect(
      45,
      295,
      505,
      65,
      8
    )
    .fillColor(cinzaClaro)
    .fill();

  pdf
    .fillColor(cinza)
    .font('Helvetica')
    .fontSize(9)
    .text(
      'CLIENTE',
      65,
      313
    );

  pdf
    .fillColor(preto)
    .font('Helvetica-Bold')
    .fontSize(13)
    .text(
      nome,
      65,
      329
    );

  /*
  ==================================================
  SERVIÇO
  ==================================================
  */

  pdf
    .fillColor(preto)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(
      'SERVIÇO REALIZADO',
      45,
      395
    );

  pdf
    .fillColor(preto)
    .font('Helvetica')
    .fontSize(12)
    .text(
      servico,
      45,
      420,
      {
        width: 505,
      }
    );

  /*
  ==================================================
  DETALHES DO CARTUCHO
  ==================================================
  */

  pdf
    .fillColor(preto)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(
      'DETALHES DO CARTUCHO',
      45,
      465
    );

  pdf
    .roundedRect(
      45,
      490,
      505,
      80,
      8
    )
    .lineWidth(1)
    .strokeColor('#D0D5DD')
    .stroke();

  pdf
    .fillColor(preto)
    .font('Helvetica')
    .fontSize(11)
    .text(
      detalhesCartucho || 'Não informado',
      60,
      510,
      {
        width: 475,
        height: 50,
      }
    );

  /*
  ==================================================
  VALOR
  ==================================================
  */

  pdf
    .roundedRect(
      45,
      605,
      505,
      90,
      10
    )
    .fillColor(azul)
    .fill();

  pdf
    .fillColor('#DCE7FF')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(
      'VALOR TOTAL',
      70,
      625
    );

  pdf
    .fillColor(branco)
    .font('Helvetica-Bold')
    .fontSize(25)
    .text(
      `R$ ${valor}`,
      70,
      644
    );

  pdf
    .fillColor('#DCE7FF')
    .font('Helvetica')
    .fontSize(9)
    .text(
      `(${valorExtenso})`,
      300,
      649,
      {
        width: 220,
        align: 'right',
      }
    );

  /*
  ==================================================
  RODAPÉ
  ==================================================
  */

  pdf
    .moveTo(45, 755)
    .lineTo(550, 755)
    .strokeColor('#EAECF0')
    .lineWidth(1)
    .stroke();

  pdf
    .fillColor(cinza)
    .font('Helvetica')
    .fontSize(9)
    .text(
      'Obrigado pela preferência!',
      45,
      775,
      {
        width: 505,
        align: 'center',
      }
    );

  pdf
    .fontSize(8)
    .fillColor('#98A2B3')
    .text(
      `${empresa} • Recibo`,
      45,
      795,
      {
        width: 505,
        align: 'center',
      }
    );

  // Finaliza PDF
  pdf.end();
});
console.log('VERSAO NOVA DO SERVIDOR - MASTER CARTUCHOS');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});