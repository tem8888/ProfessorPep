const Discord = require('discord.js'); 
const GuildModel = require('../models/guild.js');

module.exports.run = async (client, msg, args) => { 
	if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Префикс может изменять только админ сервера.");
//	const args = msg.content.slice(guild.prefix.length).trim().split(/ +/g);
	const newprefix = args[0];
 	
 	if (!args[0]) return msg.channel.send("Не был введен префикс")

 	const newprefixfix = newprefix.replace(/[^\x00-\x7F]/g, "");
 	if (newprefixfix.length < 1) return msg.channel.send("Префикс не может содержать ascii символов")
 	if (newprefix.length > 4) return msg.channel.send("Префикс не может быть длиннее 4 символов")
 	await GuildModel.findOneAndUpdate({idGuild: msg.guild.id}, {$set: {prefix: newprefixfix}}).then(()=>{

 		msg.channel.send(`Установлен новый префикс ➞  \` ${newprefix} \``);
 		client.user.setActivity(`${newprefixfix}help -- on ${client.guilds.size} servers`);

 	}).catch(err => console.log(err));   

}

module.exports.help = {
	name: 'prefix'
}