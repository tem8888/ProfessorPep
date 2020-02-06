const GuildModel = require('../models/guild.js');
var fs = require('fs');

module.exports = async (bot, guild) => {
 // This event triggers when the bot joins a guild.

    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setActivity(`${guild.prefix}help -- on ${bot.guilds.size} servers`);
    const doc = new GuildModel({idGuild: guild.id, nameGuild: guild.name, guildMembers: guild.memberCount})
    await doc.save();
    const owner = guild.owner.user
  	let guildMsg = [
      "Вас приветствует чат-бот викторины. Несколько пунктов по использованию.",
      "**1.** Дефолтный префикс ` ? `. Чтобы его изменить, введите на сервере ` ?prefix новый_префикс `",
      "**2.** Список всех команд ` ?help ` ",
      "**3.** Команды не работают в личных сообщениях.",
      "**4.** Перед использованием бота требуется указать канал, в котором он будет работать: ` !channel ID_канала `",
      "**5.** Запустить вопрос: ` ?старт `",
      "**6.** При угаданном ответе следующий вопрос будет выбираться автоматически.",
      "**7.** При неугаданном ответе потребуется прожать реакцию под ",
      "**8.** Дефолтное время на подсказку составляет 8 секунд, его можно изменить командой ` ?time время_в_милисекундах `, (8сек = 8000)",
      "**9.** Топ пользователей викторины можно посмотреть по команде ` ?топ `",
  	]
  	owner.send(guildMsg)

    fs.appendFile('logs.txt', `I have been added to: ${guild.name} (id: ${guild.id}, members: ${guild.memberCount})\r\n`, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
}