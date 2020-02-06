const Discord = require('discord.js'); 
const GuildModel = require('../models/guild.js');
let k;

module.exports.run = async (client, msg, args) => { 
	
	if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Это может сделать только админ сервера.");
	
  //  const args = msg.content.slice(config.prefix.length).split(' ');
  	if (!args[0]) return msg.channel.send("Не указано число вопросов !турнир [число вопросов]");

 //  const command = args.shift().toLowerCase();
    let qNum = args[0]; 


    if (!Number.isInteger(Number(qNum))) return msg.channel.send("Параметр должен быть целым числом.");

    if (args[0] === '0') {
    	msg.channel.send(`Турнирный режим выключен.`);
    	qNum = 0; k = 0;
    	return qNum;
    } 
    k = 1; //k - счетчик вопросов в турнирном режиме; qNumber - число вопросов
    await GuildModel.findOneAndUpdate({idGuild: msg.guild.id}, {$inc : {tournamentCount: 1}}); 
    msg.channel.send(`Турнирный режим **on**. Вопросов: **${qNum}**. Для старта введите !старт`);
    return qNum;
}

module.exports.help = {
	name: 'турнир'
}