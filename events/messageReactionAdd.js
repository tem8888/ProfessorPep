// Поправить: Нужно обнулить checkUser если голосов для скипа не хватило и если не был запущен следующий вопрос.

const GetHints = require('../functions/interval.js');
const GuildModel = require('../models/guild.js');

let skipCount = 0; let skipUser = []; let skipCheck; let questionID; let voteMessageID;

module.exports = async function(bot, reaction, user) {

	if (reaction.emoji.name === '⏩' && user.bot) { // Проверка начала вопроса (ставится кнопка скипа от бота)
		questionID = reaction.message.id; // Скип должен работать только для последнего вопроса, поэтому запоминаем его ID
		skipCheck = false; // Скип должен работать только во время вопроса
		voteCheck = false;
		skipUser = []; // При новом вопросе обнуляем список юзеров нажавших на скип
		skipCount = 0; // При новом вопросе обнуляем количество скипов
		return; 
	}
	if (reaction.emoji.name === '🆗' && user.bot) { 
		voteMessageID = reaction.message.id; 
		voteCheck = true;
		skipUser = [];
		return;
	}

	if (reaction.emoji.name === '⏩' && !skipUser.includes(user.id) && (reaction.message.id === questionID)) {
		skipCount += 1;
		skipUser.push(user.id);
		
		GuildModel.findOne({idGuild: reaction.message.channel.guild.id}).then( async (guild) => {
			if (skipCount >= guild.skipLimit && !skipCheck){ // Если число голосов за скип больше установленных И вопрос в данный момент активен, то скипаем

				GetHints.interval(); // прерываем появление подсказок
				skipCheck = true;
				bot.channels.get(reaction.message.channel.id).send('_ _\n⏭️ Пропускаем вопрос. Выбираю новый...\n_ _');

				setTimeout(async function(){ 
	                let skipNext = await bot.channels.get(reaction.message.channel.id).send(`${guild.prefix}старт`);
	                await skipNext.delete();
	            }, 3000);
			}	
		})

	}

	if (reaction.emoji.name === '🆗' && (reaction.message.id === voteMessageID)) {

		if (voteCheck)	{ // Если вопрос в данный момент не активен, то выбираем новый
			voteCheck = false;
			bot.channels.get(reaction.message.channel.id).send('Выбираю новый вопрос 🙇‍♂️');
			
			GuildModel.findOne({idGuild: reaction.message.channel.guild.id}).then( async (guild) => {
				setTimeout(async function(){ 
	                let skipNext = await bot.channels.get(reaction.message.channel.id).send(`${guild.prefix}старт`);
	                await skipNext.delete();
	            }, 3000);
	         });
		}
	}


}