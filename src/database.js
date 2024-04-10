import mysql from 'mysql'

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'godeye'
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

// Função para salvar o número do remetente no banco de dados
export async function savePhoneNumber(phoneNumber) {
  const sql = `INSERT INTO acess_bot (numero) VALUES (?)`;
  const values = [phoneNumber];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar o número do telefone:', err);
      throw err;
    }
    console.log('Número do telefone salvo com sucesso:', phoneNumber);
  });
}

export async function saveName(phoneNumber, nome) {
  const sql = `UPDATE acess_bot SET nome = ? WHERE numero = ?`;
  const values = [nome, phoneNumber];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar o nome:', err);
      throw err;
    }
    console.log('Nome salvo com sucesso para o número:', phoneNumber);
  });
}

export async function saveEmail(phoneNumber, email) {
  const sql = `UPDATE acess_bot SET email = ? WHERE numero = ?`;
  const values = [email, phoneNumber];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar o email:', err);
      throw err;
    }
    console.log('Email salvo com sucesso para o número:', phoneNumber);
  });
}

export async function CadastrOK(phoneNumber) {
  const sql = `UPDATE acess_bot SET cadastro = 1 WHERE numero = ?`;
  const values = [phoneNumber];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o Cadastro:', err);
      throw err;
    }
    console.log('Cadastro salvo com sucesso para o número:', phoneNumber);
  });
}




export async function getPhoneNumberInfo(phoneNumber) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM acess_bot WHERE numero = ?`;
      const values = [phoneNumber];
  
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error('Erro ao obter informações do número de telefone:', err);
          reject(err);
        }
        
        if (results.length === 0) {
          resolve(null); // Número não encontrado
        } else {
          const phoneNumberInfo = results[0];
          resolve(phoneNumberInfo);
        }
      });
    });


}

export async function incrementQtdConsultas(phoneNumber) {
  const sqlSelect = `SELECT qtdconsultas FROM acess_bot WHERE numero = ?`;
  const sqlUpdate = `UPDATE acess_bot SET qtdconsultas = qtdconsultas + 1 WHERE numero = ?`;
  const values = [phoneNumber];

  connection.query(sqlSelect, values, (err, results) => {
    if (err) {
      console.error('Erro ao selecionar qtdconsultas:', err);
      throw err;
    }

    if (results.length === 0) {
      console.error('Número não encontrado:', phoneNumber);
      return;
    }

    const currentQtdConsultas = results[0].qtdconsultas;
    connection.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error('Erro ao incrementar qtdconsultas:', err);
        throw err;
      }
      console.log('Qtdconsultas incrementado com sucesso para', currentQtdConsultas + 1);
    });
  });

}


export async function getProfile(phoneNumber) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM acess_bot WHERE numero = ?`;
    const values = [phoneNumber];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Erro ao obter informações do Perfil:', err);
        reject(err);
      }
      
      if (results.length === 0) {
        resolve(null); // Número não encontrado
      } else {
        const phoneNumberInfo = results[0];
        resolve(phoneNumberInfo);
      }
    });
  });


}
