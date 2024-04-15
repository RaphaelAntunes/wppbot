import { VenomBot } from '../venom.js'
import { saveEmail } from '../database.js' 
import { CadastrOK } from '../database.js' 
import { stages, getStage } from '../stages.js'

import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageFour = {
  async exec(params) {
    const venombot = await VenomBot.getInstance();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(emailRegex.test(params.message)){

      if(saveEmail(params.from,params.message)){
        await CadastrOK(params.from);
        const msg = `Você pode alterar seu perfil a qualquer momento com o comando

*!perfil*`;
      await sendMessageWithDelay(venombot, params.from, 'Obrigado, atrelei o e-mail (*'+params.message+'*) a seu perfil', 1000);
      await sendMessageWithDelay(venombot, params.from, msg, 1000);
      await stages[1].stage.exec({
        from: params.from,
        message: storage['lastplaca'] ,
      })
      }else{
        await sendMessageWithDelay(venombot, params.from, 'Houve um problema, tente novamente mais tarde!', 1000);

      }

     

    }else{
      await sendMessageWithDelay(venombot, params.from, 'O email digitado não é válido. Digite um e-mail válido', 1000);

    }


  },
};





async function sendMessageWithDelay(bot, to, message, delay) {
  return new Promise(resolve => {
    setTimeout(async () => {
      await bot.sendText({ to, message });
      resolve();
    }, delay);
  });
}
