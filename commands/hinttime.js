const Discord = require('discord.js');
const GuildModel = require('../models/guild.js');

module.exports.run = async (client, msg, args) => { 
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Время появления подсказок может изменять только админ сервера.");
    const htime = Number(args[0]);
    if (!args[0]) return msg.channel.send("Не был введен параметр.");

    if (!Number.isInteger(htime) || htime < 1000 || htime > 10000) return msg.channel.send("Параметр должен быть целым числом от 1000 до 10000.");

    await GuildModel.findOneAndUpdate({idGuild: msg.guild.id}, {$set: {hintTime: htime}}).then(()=>{

        msg.channel.send(`Установлено время появления подсказок ➞  \` ${htime/1000} \` секунд(-ы)`);

    }).catch(err => console.log(err));   
}

module.exports.help = {
	name: 'hinttime'
}