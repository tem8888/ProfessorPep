const Discord = require('discord.js'); 
const config = require('../config.js');

module.exports.run = async (client, message) => { 
    message.channel.send({embed:{
    color: 16777215,
    title: "Викторина",
    url: "https://fmfan.ru",
    description: "00673792>",
    thumbnail: {
      "url": client.user.displayAvatarURL
    },
    timestamp: new Date(),
    fields: [
            {
              "name": 'Команда',
              "value": `!след\n!топ\n!турнир N`,
              "inline": true
            },
            {
              "name": 'Описание',
              "value": `Запускает следующий вопрос\nВыводит таблицу лидеров\nЗапускает турнирный режим`,
              "inline": true
            }
            ],      
    footer: {
      icon_url: client.user.avatarURL,
      text: "Если вам нужна помощь, просто спросите 🙂"
    }
 }});
}

module.exports.help = {
	name: 'qhelp'
}