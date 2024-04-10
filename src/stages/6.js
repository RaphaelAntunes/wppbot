import { VenomBot } from '../venom.js'

import { getProfile } from '../database.js' 


export const PerfilStage = {
  async exec(params) {

    const venombot = await VenomBot.getInstance();
    const perfil = await getProfile(params.from);
    let vipStatus = perfil.vip == 1 ? "Sim" : "Não";
    const msg = `Essas são suas informações do perfil: 🪪
    
Nome: *${perfil.nome}*
E-mail: *${perfil.email}*
VIP: *${vipStatus}*`; 
    await sendMessageWithDelay(venombot, params.from, msg, 2000);
    await sendMessageWithDelay(venombot, params.from, '', 2000);

    
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
  