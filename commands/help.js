const Discord = require('discord.js')
const GuildModel = require('../models/guild.js')

module.exports.run = async (client, msg) => {
  GuildModel.findOne({ idGuild: msg.guild.id }).then(async (guild) => {
    let prefix = guild.prefix
    msg.channel.send({
      embed: {
        color: 16777215,
        title: 'Викторина',
        url: 'https://fmfan.ru',
        description: 'Чат-бот для Discord',
        //     thumbnail: {
        //     "url": client.user.displayAvatarURL
        //    },
        timestamp: new Date(),
        fields: [
          {
            name: 'Команда',
            value: `${prefix}старт\n${prefix}турнир N (для админов)\n${prefix}top\n${prefix}qhelp\n${prefix}prefix (для админов)\n${prefix}channel (для админов)\n${prefix}skiplimit (для админов)\n${prefix}hinttime (для админов)\n${prefix}upl (для админов)\n${prefix}default (для админов)`,
            inline: true,
          },
          {
            name: 'Описание',
            value: `Запускает новый вопрос\nЗапускает турнирный режим\nВыводит таблицу лидеров\nВыводит список команд\nСмена префикса для команд\nСмена или установка канала для работы викторины\nКоличество голосов для пропуска вопроса\nВремя между подсказками\nВыполняется при загрузке txt-файла с вопросами\nВозвращает дефолтную базу вопросов`,
            inline: true,
          },
        ],
        footer: {
          icon_url: client.user.avatarURL,
          text: 'Автор: tem',
        },
      },
    })
  })
}

module.exports.help = {
  name: 'qhelp',
}
