import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'
import { saveName } from '../database.js' // Supondo que você tenha um arquivo database.js com funções para interagir com o banco de dados

export const stageThree = {
  async exec(params) {

  const venombot = await VenomBot.getInstance()
 
  if(saveName(params.from,params.message)){
    await sendMessageWithDelay(venombot, params.from,  'Certo, vou te achamar de: *'+params.message+'* 🪪', 2000)
    await sendMessageWithDelay(venombot, params.from,  'Me informa seu endereço de *e-mail*', 1000)
    storage[params.from].stage = STAGES.SALVAEMAIL
  
  }else{
    await sendMessageWithDelay(venombot, params.from, 'Houve um problema, tente novamente mais tarde!', 1000);
  }
  
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
