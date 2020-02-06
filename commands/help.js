const Discord = require('discord.js'); 
const GuildModel = require('../models/guild.js');

module.exports.run = async (client, msg) => { 
    GuildModel.findOne({idGuild: msg.guild.id}).then( async (guild) => {
    let prefix = guild.prefix;
        msg.channel.send({embed:{
            color: 16777215,
            title: "Викторина",
            url: "https://fmfan.ru",
            description: "Чат-бот для Discord",
       //     thumbnail: {
         //     "url": client.user.displayAvatarURL
        //    },
            timestamp: new Date(),
            fields: [
                    {
                      "name": 'Команда',
                      "value": `${prefix}старт\n${prefix}турнир N\n${prefix}top\n${prefix}help\n${prefix}prefix (нужны права админа)\n${prefix}channel (нужны права админа)\n${prefix}skiplimit (нужны права админа)\n${prefix}hinttime (нужны права админа)\n${prefix}upl (нужны права админа)\n${prefix}default (нужны права админа)`,
                      "inline": true
                    },
                    {
                      "name": 'Описание',
                      "value": `Запускает новый вопрос\nЗапускает турнирный режим\nВыводит таблицу лидеров\nВыводит список команд\nСмена префикса для команд\nСмена или установка канала для работы викторины\nКоличество голосов для пропуска вопроса\nВремя между подсказками\nВыполняется вместе с загрузкой txt-файла с вопросами\nВозвращает дефолтную базу вопросов`,
                      "inline": true
                    }
                    ],      
            footer: {
              icon_url: client.user.avatarURL,
              text: "Автор: tem"
            }
        }});
    });
}

module.exports.help = {
	name: 'qhelp'
}