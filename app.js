const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos da pasta 'public'

// Configuração de conexão com o SQL Server
const config = {
    user: 'appUser2',
    password: '1234@',
    server: 'localhost',
    database: 'Biblioteca_S',
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Função para gerenciar a conexão com o banco
async function connectToDatabase() {
    try {
        if (!sql.pool) {
            await sql.connect(config);
            console.log('Conectado ao SQL Server');
        }
    } catch (error) {
        console.error('Erro de conexão com o banco:', error);
    }
}

// Rota para registrar a frequência
app.post('/registrar-frequencia', async (req, res) => {
    const { nomeCompleto, identUser } = req.body;

    try {
        await connectToDatabase();

        // Insere dados na tabela `frequencia`
        await sql.query`INSERT INTO frequencia (NomeCompleto, Ident_User) VALUES (${nomeCompleto}, ${identUser})`;
        res.json({ message: 'Frequência registrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar frequência:', error);
        res.status(500).json({ message: 'Erro ao registrar a frequência' });
    }
});

// Rota para buscar os dados da tabela `frequencia`
app.get('/api/frequencia', async (req, res) => {
    const { startDate, endDate, date } = req.query; // Recebe parâmetros de data

    try {
        await connectToDatabase();

        let query = 'SELECT * FROM frequencia';

        // Se startDate e endDate forem fornecidos, filtra pelos registros entre essas datas
        if (startDate && endDate) {
            query += ` WHERE DataHoraMomento BETWEEN '${startDate}' AND '${endDate}'`;
        } else if (date) {
            // Se apenas uma data for fornecida, filtra os registros dessa data
            query += ` WHERE CAST(DataHoraMomento AS DATE) = '${date}'`;
        }

        query += ' ORDER BY DataHoraMomento DESC'; // Ordena pela data

        // Executa a consulta no banco
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ message: 'Erro ao buscar dados' });
    }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
