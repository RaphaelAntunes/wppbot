import { VenomBot } from '../venom.js'

export const finalStage = {
  async exec(params) {

    const venombot = await VenomBot.getInstance()
   
    await sendMessageWithDelay(venombot, params.from,  'Hmm, seu teste acabou', 2000)

    
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
  