module.exports = (bot) => {

		console.log(`${bot.user.tag} has started in ${bot.guilds.size} guilds.`);
  		bot.user.setActivity(`!qhelp -- on ${bot.guilds.size} servers`);

};