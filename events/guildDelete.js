const GuildModel = require('../models/guild.js');
var fs = require('fs');

module.exports = async (bot, guild) => {

    bot.user.setActivity(`!help -- on ${bot.guilds.size} servers`);
    await GuildModel.findOneAndDelete({idGuild: guild.id}) 

    fs.appendFile('logs.txt', `I have been removed from: ${guild.name} (id: ${guild.id}, members: ${guild.memberCount})\r\n`, function (err) {
        if (err) throw err;
        console.log('delete log saved!');
    });
}

 