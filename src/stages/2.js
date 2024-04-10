import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageTwo = {
  async exec(params) {
    const message = params.message
    
 // Envia Mensagens de Tutorial
 const venombot = await VenomBot.getInstance()
 const message1 = `✋🏼 Espere um pouco... 🛑`
 const message2 = `Para continuar precisamos fazem um pequeno cadastro.

Qual seu *Nome* ? *Apelido*, ou como gostaria de ser *Chamado* ?`
 const message3 = `Ex..: *Renato Silva*`
 await sendMessageWithDelay(venombot, params.from, message1)
 await sendMessageWithDelay(venombot, params.from, message2, 2000)
 await sendMessageWithDelay(venombot, params.from, message3)  
 storage[params.from].stage = STAGES.SALVANOME 

},
}


async function sendMessageWithDelay(bot, to, message, delay) {
  return new Promise(resolve => {
    setTimeout(async () => {
      await bot.sendText({ to, message });
      resolve();
    }, delay);
  });
}
