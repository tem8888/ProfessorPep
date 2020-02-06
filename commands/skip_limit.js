const Discord = require('discord.js');
const GuildModel = require('../models/guild.js');

module.exports.run = async (client, msg, args) => { 
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Количество голосов для пропуска вопросов может изменять только админ сервера.");
    const limit = Number(args[0]);
    if (!args[0]) return msg.channel.send("Не был введен параметр.");
    console.log(limit);
    if (!Number.isInteger(limit)) return msg.channel.send("Параметр должен быть целым числом.");
    await GuildModel.findOneAndUpdate({idGuild: msg.guild.id}, {$set: {skipLimit: limit}}).then(()=>{

        msg.channel.send(`Минимальное количество голосов для пропуска вопроса ➞  \` ${limit} \``);

    }).catch(err => console.log(err));   
}

module.exports.help = {
	name: 'skiplimit'
}