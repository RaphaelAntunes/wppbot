import { VenomBot } from './venom.js'
import { stages, getStage } from './stages.js'
import { savePhoneNumber } from './database.js'
import { getPhoneNumberInfo } from './database.js'
const main = async () => {
  try {
    const venombot = await VenomBot.getInstance().init({
      session: 'Godeye BOT',
      headless: false,
      useChrome: true,
    })

    venombot.onMessage(async (message) => {
      if (message.isGroupMsg) return

      const currentStage = getStage({ from: message.from })
      console.log(currentStage);
      const isClient = await getPhoneNumberInfo(message.from);
      
      if (isClient) {

        if(message.body == "!perfil" || message.body == "perfil"){
          await stages[6].stage.exec({
            from: message.from,
            message: message.body,
          })
          return
        }

        
         if (isClient.vip == 1) {
            await stages[1].stage.exec({
              from: message.from,
              message: message.body,
            })
          } else {
            // SE NAO TEM CADASTRO E FEZ TODAS AS CONSULTAS = CADASTRO
            if (isClient.cadastro == 0 && isClient.qtdconsultas >= 1) {
              // SE NÃO TIVER CADASTRADO NOME NEM EMAIL MANDA PRO CADASTRO GERAL
              if (isClient.nome == null && isClient.email == null) {
                if(currentStage == 3){
                  await stages[3].stage.exec({
                    from: message.from,
                    message: message.body,
                  })
                }else{
                  await stages[2].stage.exec({
                    from: message.from,
                    message: message.body,
                  })
                }
                
              }
              // SE TIVER CADASTRADO NOME E NÃO EMAIL MANDA PRO CADASTRO EMAIL
              else if (isClient.nome != null) {
                await stages[4].stage.exec({
                  from: message.from,
                  message: message.body,
                })
                // SE FOR AO CONTRARIO MANDA PRO NOME   
              } else {
                await stages[3].stage.exec({
                  from: message.from,
                  message: message.body,
                })
              }

            } else {
              if(isClient.qtdconsultas >=30){
                await stages[5].stage.exec({
                  from: message.from,
                  message: message.body,
                })              }else{
                await stages[1].stage.exec({
                  from: message.from,
                  message: message.body,
                })
              }
          
            }
          }

      }
      else {
        // Se não for salvao numero e começa pelo estagio 0
        await stages[currentStage].stage.exec({
          from: message.from,
          message: message.body,
        })
      }
     


    })
  } catch (error) {
    console.error(error)
  }
}

main()
