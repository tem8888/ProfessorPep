const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.js');
const GuildModel = require('../models/guild.js');

let timerId; let stopCheck = 0; let embedFooter; let embedColor; let numq; let k=0;

module.exports.run = async (client, message, question, answer, qNum, k) => { 
  	if (!client) {
        clearInterval(timerId);
        return hint;
    }

    let len = answer.length - 1;
    let randCongrat = Math.floor(Math.random() * 6) + 1;
  
    GuildModel.findOne({idGuild: message.guild.id}).then( async (guild) => {

        if (!qNum) { // Меняем цвет и футер эмбеда с вопросов в зависимости Турнир это или нет
            embedColor = 2384535; 
            numq = '';
            k = 0;
            embedFooter = `Жмите ⏭️, для пропуска вопроса (минимум ${guild.skipLimit} голоса(-ов)). Подсказки появляются каждые ${guild.hintTime/1000} сек`;
        } else {
            embedColor = 10370632; 
            k += 1;
            numq = `Вопрос ${k} из ${qNum} ㆍ `;
            embedFooter = `Скип вопроса в турнире недоступен. Подсказки появляются каждые ${guild.hintTime/1000} сек`;
        }

        let quest = await message.channel.send({embed:{
            "title": `${question}`,
            "color": embedColor,
            "description": `${numq}БУКВ: ${len}  `,
            "footer": {
                "text": `${embedFooter}`
            }
              }});
            if (!qNum) await quest.react('⏩');
        });

    var hintArray = []; // массив слов-подсказок

    function get_line(filename, line_num, callback) {
        callback(null, quizLine); 
    }

    String.prototype.replaceAt=function(index, replacement) {
      return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
    }

    get_line(config.url_file, randm, function(err, line) {   // получаем рандомную строку со словом из файла
      var hintWord = answer.replace(/([А-ЯЁа-яёa-z0-9,.])/gi,'•'); // замещаем все слово звездочками *
      var id_index_array = []; // создаем массив для рандомных ключей
// Генерируем уникальные индексы для открываемых букв
      function generateRandom(min, max) { 
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (id_index_array.length != len) { // выходим из функции, если длина массива равна длине слова
          return (id_index_array.includes(num)) ? generateRandom(min, max) : num;
        }
      }
//определяем кол-во подсказок в зависимости от длины слова
      var hint_len = (len > 3 && len <= 8) ? 2 : (len > 8 && len <= 12) ? 3 : (len > 12 && len <= 15) ? 4 : (len > 16) ? 5 : 1; 
 
      for (i=0; i<len-hint_len; i++) { // цикл для собирания и открывания случайных букв
          rand_index_2 = generateRandom(0, len-1); // возвращаем из функции уникальные значения индексов
          id_index_array.push(rand_index_2); // пушим их в массив
        if ((answer[rand_index_2] != ' ')) {
            hintWord = hintWord.replaceAt(rand_index_2, ""+answer[rand_index_2]+""); // заменяем звездочки на буквы
            hintArray.push(hintWord); // пушим поочередные слова с открытыми буквами в массив
        }
      } 

  });
    return hintArray;
}

module.exports.help = {
	name: 'next'
}