import { VenomBot } from '../venom.js'
import axios from 'axios';
import { incrementQtdConsultas } from '../database.js' // Supondo que você tenha um arquivo database.js com funções para interagir com o banco de dados

export const stageOne = {
  async exec(params) {
    {
      const message = params.message;
      var messagefiltred = message.replace(/[^a-zA-Z0-9]/g, '');

      ///////////////////////// FUNÇÕES /////////////////////////////
      function formatarString(str) {
        // Encontre a posição do primeiro espaço
        const posPrimeiroEspaco = str.indexOf('-');
        // Remova os caracteres até o primeiro espaço
        const strSemNumero = str.slice(posPrimeiroEspaco + 1);
        // Remova os parênteses
        const strFormatada = strSemNumero.replace(/[\(\)]/g, '');
        return strFormatada;
      }

      function verificarTamanhoMensagem(messagefiltred) {

        if (messagefiltred.length === 7) {
          VenomBot.getInstance().sendText({ to: params.from, message: 'Pesquisando...' });
          return true;

        } else {
          return false;
        }
      }

      // Exemplo de uso:
      var tamanhoCorreto = verificarTamanhoMensagem(messagefiltred);

      if (tamanhoCorreto) {
        try {
          const tokenResponse = await axios.get('https://godeye.fun/api/token');
          const dataResponse = await axios.get('https://godeye.fun/api/d/' + messagefiltred);

          // Verifica se a resposta contém o token
          if (tokenResponse.data) {
            // Extrai as informações relevantes da resposta
            console.log(dataResponse.data.length)
            if (dataResponse.data.length == 4) {

              var vehicleData = dataResponse.data[0].data;
              var MultasData = dataResponse.data[1].data;
              var debtsData = dataResponse.data[2].data;
              var infractionsData = dataResponse.data[3].data;




            } else if (dataResponse.data.length == 5) {


              var vehicleData = dataResponse.data[0].data;
              var MultasData = dataResponse.data[1].data;
              var userData = dataResponse.data[2].data;
              var debtsData = dataResponse.data[3].data;
              var infractionsData = dataResponse.data[4].data;
              var cpf = dataResponse.data[3].cpf;
            }


            let messageToSend = '';
            // Monta a mensagem com as informações extraídas
            if (vehicleData.classe == 'rev-furto-roubo') {
              messageToSend += `🚨🚨 *VEÍCULO COM QUEIXA ROUBO/FURTO ATIVA* 🚨🚨\n\n`;
            }
            if (vehicleData.classe == 'rev-restricao') {
              document.getElementById("card-roubo").innerHTML = 'Veículo com restrição';
              messageToSend += `🚨🚨 VEÍCULO COM RESTRIÇÃO ATIVA 🚨🚨 `;

            }

            messageToSend += '🪪 *Informações do Proprietário:* 🪪\n\n';
            if (userData) {

              if (userData == "Usuário não localizado") {
                messageToSend += `*Nome:* ${vehicleData.nomeProprietario}\n`;
                messageToSend += `*CPF:* ${cpf}\n`;

              } else {
                var dataFormatada = new Date(userData.datanascimento).toLocaleDateString('pt-BR');
                messageToSend += `*Nome:* ${userData.nome || 'Não disponível'}\n`;
                messageToSend += `*CPF:* ${userData.documento || 'Não disponível'}\n`;
                messageToSend += `*Telefone:* ${userData.telefone || 'Não disponível'}\n`;
                messageToSend += `*Email:* ${userData.email || 'Não disponível'}\n`;
                messageToSend += `*Data de Nascimento:* ${dataFormatada || 'Não disponível'}\n`;
              }

            } else {
              messageToSend += `*Nome:* ${vehicleData.nomeProprietario}\n`;

            }

            messageToSend += '\n🚗 *Informações do Veículo:* 🚗\n\n';
            if (vehicleData) {
              if (cpf) {
                try {
                  var crlv = `placa=${vehicleData.placa}&renavam=${vehicleData.renavam}&documentoProprietario=${cpf}`;
                  var response = await axios.get(`https://godeye.fun/sl/${crlv}`);
                  var link = response.data;
                  messageToSend += `*--------------------------------*\n\n`;

                  messageToSend += `*BAIXE O CRLV:* https://godeye.fun/crlv/${link.Data}\n\n`;

                  messageToSend += `*--------------------------------*\n\n`;

                } catch (error) {
                  console.error('Erro ao buscar o link:', error);
                }
              }


              messageToSend += `*Marca/Modelo:* ${vehicleData.marcaModelo} - ${formatarString(vehicleData.cor)} - ${vehicleData.anoFabricacaoModelo}\n`;
              messageToSend += `*Combustível*: ${formatarString(vehicleData.combustivel)}\n`;
              messageToSend += `*Placa:* ${vehicleData.placa}\n`;
              messageToSend += `*Placa Anterior:* ${vehicleData.placaAnterior}\n`;
              messageToSend += `*Renavam:* ${vehicleData.renavam}\n`;
              messageToSend += `*Emplacamento em:* ${vehicleData.municipioEmplacamento}\n`;
              messageToSend += `*Proprietario Anterior:* ${vehicleData.proprietarioAnterior}\n`;
              messageToSend += `*Data de Compra:* ${vehicleData.dataAquisicao}\n`;

            } else {
              messageToSend += 'Informações do veículo não disponíveis.\n';
            }

            messageToSend += '\n⚠️ *Infrações de Trânsito em Aberto:* ⚠️\n\n';
            if (infractionsData && infractionsData.length > 0) {
              let counter = 1; // Inicializa o contador

              infractionsData.forEach((infraction) => {
                var horaFormatada = infraction.horaAutuacao.slice(0, 2) + ":" + infraction.horaAutuacao.slice(2);

                messageToSend += `_*Infração N° #${counter}:*_\n\n`;
                messageToSend += `*Auto da Infração:* ${infraction.descricaoAuto}\n`;
                messageToSend += `*Descrição da Infração:* ${infraction.descricaoInfracao} - ${infraction.complemento} \n`;
                messageToSend += `*Local:* ${infraction.localInfracao}\n`;
                messageToSend += `*Data e Hora:* ${infraction.dataAutuacao} às ${horaFormatada} \n\n`;
                counter++; // Incrementa o contador
              });
            } else {
              messageToSend += 'Nenhuma infração de trânsito registrada.\n';
            }

            messageToSend += '\n🚦 *Multas de Trânsito em Aberto:* 🚦\n\n';

            if (MultasData && MultasData.length > 0) {
              let counter = 1; // Inicializa o contador

              MultasData.forEach((multas) => {
                var horaFormatada = multas.horaAutuacao.slice(0, 2) + ":" + multas.horaAutuacao.slice(2);
                const debitoRelacionado = debtsData.find(debito => debito.descricaoClasse === multas.descricaoAuto);

                messageToSend += `_*Multa N° #${counter}:*_\n\n`;
                messageToSend += `*Auto da Infração:* ${multas.descricaoAuto}\n`;
                messageToSend += `*Descrição da Infração:* ${multas.descricaoInfracao} - ${multas.complemento} \n`;
                messageToSend += `*Local:* ${multas.localInfracao}\n`;
                messageToSend += `*Data e Hora:* ${multas.dataAutuacao} às ${horaFormatada} \n\n`;
                messageToSend += `*Situação:* ${multas.descricaoStatus}\n`;
                if (debitoRelacionado) {
                  messageToSend += `*Valor Atualizado:* R$ ${debitoRelacionado.valorAtualizado.toFixed(2)}\n\n`;
                }
                counter++; // Incrementa o contador
              });
            } else {
              messageToSend += 'Nenhuma infração de trânsito registrada.\n';
            }


            messageToSend += '\n🧾 *Debitos do Veículo em Aberto:* 🧾\n\n';
            if (debtsData && debtsData.length > 0) {
              for (const debt of debtsData) {
                var link = `NossoNumero=${debt.nossoNumero}&codigo=${debt.codigoSeguranca}&iddebito=${debt.idDebito}&Classe=${debt.classe}&UF=RN`;
                messageToSend += `*Descrição:* ${debt.descricaoClasse} - ${debt.exercicio} \n`;
                messageToSend += `*Data Vencimento:* ${debt.dataVencimento}\n`;
                messageToSend += `*Valor Atualizado: R$* ${debt.valorAtualizado}\n`;

                try {
                  var response = await axios.get(`https://godeye.fun/sl/${link}`);
                  var link = response.data;
                  messageToSend += `*Link Pagamento*: https://godeye.fun/pay/${link.Data}\n\n`;
                  messageToSend += `*--------------------------------*\n\n`;

                } catch (error) {
                  console.error('Erro ao buscar o link:', error);
                }
              }
            } else {
              messageToSend += 'Nenhum débito relacionado ao veículo.\n';
            }





            // Envia a mensagem organizada para o usuário
            await VenomBot.getInstance().sendText({ to: params.from, message: messageToSend });
            incrementQtdConsultas(params.from)

          } else {
            console.error('Erro ao obter token: resposta inválida');
            await VenomBot.getInstance().sendText({ to: params.from, message: 'Resposta inválida ao obter o token.' });
          }

        } catch (error) {
          console.error('Erro ao obter token:', error);
          // Tratar caso de erro na requisição
          await VenomBot.getInstance().sendText({ to: params.from, message: '❌ Esse veículo não pertence ao RN ou a *PLACA* não existe' });
        }
      } else {
        await VenomBot.getInstance().sendText({ to: params.from, message: 'Insira uma PLACA VALIDA' });

      }


    }
  }
}
