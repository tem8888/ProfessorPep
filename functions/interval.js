const config = require('../config.js');
const congrat = require('../quiz/congrat.js');
const GuildModel = require('../models/guild.js');
let k; 

async function interval(msg, hintArray, qNum) {
	if (!hintArray) {
        clearInterval(questionInProgress);
        return;
    }
 let randCongrat = Math.floor(Math.random() * 5) + 1;
 let promise = new Promise((resolve, reject) => {
    hint = 0;
    GuildModel.findOne({idGuild: msg.guild.id}).then( async (guild) => {
        questionInProgress = setInterval(() => {
            if (hintArray[hint]) {
               msg.channel.send(`> \` Подсказка №${hint+1}: \`   ${hintArray[hint]}`);
               hint += 1;
           } else { 
                clearInterval(questionInProgress); 
                if (qNum) k = 1;        // Счетчик для турнирного режима
                resolve(false);
            }

        }, guild.hintTime);
    });

});

    questionInProgress = await promise;
    if (qNum) return k;
/*
    if (k >= qNum) { qNum = 0, k = 0; } // если турнир закончился, выключаем параметр количества вопросов
  //  if (k > 0) k = 0; // обнуляем счетчик вопросов после окончания турнира перед следующим вопросом
    console.log('k2 = '+k+', qNumber2 = '+qNum);
    if (!qNum) { // если турнира нет и ответ не угадан
        msg.channel.send(`${congrat.noAnswer[`${randCongrat}`]} **${answer}**`);
        let noAnswerVote = await msg.channel.send(`Го дальше?`);
        await noAnswerVote.react('🆗');

    } else { // если турнир есть и ответ не угадан
        msg.channel.send(`${congrat.noAnswer[`${randCongrat}`]} **${answer}**`);
        if (k < qNum) { // если это не последний вопрос в турнире
            msg.channel.send(`Выбираю новый вопрос 🙇‍♂️`);
            setTimeout(async function(){ 
                let skipNext = await msg.channel.send('!след');
                await skipNext.delete();
                return k; // возвращаем счетчик вопросов 
            }, 1500); 
        }
    }
*/
};

module.exports = {
  interval
};