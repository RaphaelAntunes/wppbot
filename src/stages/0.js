import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js'
import { savePhoneNumber } from '../database.js' // Supondo que você tenha um arquivo database.js com funções para interagir com o banco de dados

export const initialStage = {
  async exec({ from }) {
      if(storage[from].stage == STAGES.BEMVINDO){
        storage[from].stage = STAGES.PUXADA
        await savePhoneNumber(from)
        const venombot = await VenomBot.getInstance()
        const message1 = `👋 Seja Bem-vindo ao *GodEye BOT* 🚘👁️`
        const message2 = `Vamos começar, é muito simples, Digite uma *PLACA* e eu te mostro o detalhamento sobre o Veículo:`
        const message3 = `Ex..: *XYZ1234*`
        await sendMessageWithDelay(venombot, from, message1)
        await sendMessageWithDelay(venombot, from, message2, 2000)
        await sendMessageWithDelay(venombot, from, message3, 2000)

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
