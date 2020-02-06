const Discord = require('discord.js'); 

module.exports.run = async (client, msg, args) => { 

	let questionInProgress = true;
	let firstAnswer = true;

//    await GetQuizLine.getLine(); // Из answer.js получаю номер строки, вопрос и ответ
    let randm = Math.floor(Math.random() * (fullData.length-1)); // -1 из-за последней пустой строки в файле
    let quizLine = fullData[randm].split('|'); // строка-массив вопрос|ответ
    let question = quizLine[0]; // вопрос
    let answer = quizLine[1]; // ответ

    let len = answer.length - 1;
    let randCongrat = Math.floor(Math.random() * 6) + 1;
     /* для турнира
     if (!qNumber) message.channel.send(`\`\`\`fix
  ${question} Букв = ${len}\`\`\``);
      else message.channel.send(`\`\`\`ini
[Вопрос №${k}: ${question}, букв: ${len}]\`\`\``);

  message.channel.send(`\`\`\`fix
  ${question.toUpperCase()} | Букв = ${len}\`\`\``);*/

    let quest = await message.channel.send({embed:{
         // "color": 3553599,
         "title": `${question}`,
        "color": 5198940,
        //  "title": `${question}`,
          "description": `БУКВ: ${len}`
          }});
    await quest.react('⏩');

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
	name: 'ста'
}