const Discord = require('discord.js'); 
const GuildModel = require('../models/guild.js');

module.exports.run = async (client, msg, args) => { 
	if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Канал викторины может изменять только админ сервера.");
//	const args = msg.content.slice(guild.prefix.length).trim().split(/ +/g);
	const newChannelId = args[0];
 	if (newChannelId.length != 18) return msg.channel.send("Didn't provide a new prefix to set")
 	await GuildModel.findOneAndUpdate({idGuild: msg.guild.id}, {$set: {channelId: newChannelId}}).then(()=>{
 		msg.channel.send(`Канал для викторины установлен, ID ➞  \` ${newChannelId} \``);
 	}).catch(err => console.log(err)); 

}

module.exports.help = {
	name: 'channel'
}