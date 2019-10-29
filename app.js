const Discord = require('discord.js');
const client = new Discord.Client();
const pool = require ('./clientpool.js'); 
var points_write = require ('./points.js');  
const config = require('./config.js');
const questions_amount = 120000;
const fs = require('fs');
client.commands = new Discord.Collection();
let quizLine; let question; let check; let timerId; let answer;
let hint; let len; let points; let total_points; let qNumber; let k;
let cmd; let firstAnswer;
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/****************** Загрузка js файлов с командами ********************/
fs.readdir('./commands/', (err, files) => {
    if (err) console.log(err)

    let jsfiles = files.filter(f=>f.split('.').pop() === 'js')
    if(jsfiles.length <= 0) {
        console.log('Нет команд'); 
        return;
   }

    jsfiles.forEach((f,i) => {
        let props = require('./commands/'+f);
        console.log(`${f} loaded`);
        client.commands.set(props.help.name, props)
       })
})


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Викторину');
  pool.connect( (err, client, done) => {
    if(err) throw err; 
            client.query('create table if not exists quiz( \
                id text primary key, \
                name text, \
                count integer default 0, \
                points integer default 0)', (err, result) => {
                    //disconnent from database on error
            });
            client.query('create table if not exists quiz_tournament( \
                id text primary key, \
                name text, \
                count integer default 0, \
                points integer default 0)', (err, result) => {
                    //disconnent from database on error
            });
            client.query('create table if not exists guild_settings( \
                id_guild text primary key, \
                id_channel text default 0, \
                time_to_hint integer default 4000)', (err, result) => {
                    //disconnent from database on error
            });
            });
  pool.connect(err => {
  if(err) throw err; 
  console.log('Connected to PostgresSQL'); });
 });

var stringSimilarity = require('string-similarity');
let fullData = fs.readFileSync(config.url_file, 'utf8').split('\n');
//---------------------
// CLIENT.ON MESSAGE =>
//---------------------
client.on("message", (message) => {

    if (message.author.bot) return
    if (message.channel.id != config.channel) return
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(config.prefix.length)

  /****************** Проверка и запуск команд ********************/

    if (command.startsWith(config.prefix)) {
      cmd = client.commands.get(command.slice(config.prefix.length))
      if ((cmd) && (cmd.help.name == 'след') && (!timerId) ) {
          firstAnswer = true;
          timerId = true; 
          randm = Math.floor(Math.random() * (fullData.length-1)); // -1 из-за последней пустой строки в файле
          quizLine = fullData[randm].split('|'); // строка-массив вопрос|ответ
          question = quizLine[0]; // вопрос
          answer = quizLine[1]; // ответ


          len = answer.length - 1;
message.channel.send(`\`\`\`fix
  ${question} | Букв = ${len}\`\`\``);
    console.log('ответ= '+answer);
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
        var pod = hintArray;
    console.log(pod);
    //  pod = new_name_2;
      console.log('length='+len); 
      hint = 0;
/******************ВЫВОД ПОДСКАЗОК****************/
      timerId = setInterval(async function next() {
          if (hintArray[hint]) {
            message.channel.send(`> Подсказка №${hint+1}: ${hintArray[hint]}`);
            hint += 1;
          } else {
                clearInterval(timerId);
                timerId = false; 
                message.channel.send(`Слабаки, правильный ответ: ${answer}\nВыбираю новый вопрос...`);
           //   if (qNumber) k += 1; // для турнирного режима
        /*        setTimeout(async function(){ 
                    let next = await message.channel.send('!старт');
                    await next.delete();
                }, 2500); */
          }
        }, config.time_to_hint);
  });



   //       cmd.run(client, message, randm, quizLine, question, answer)
          
      }
      else if ((cmd) && (cmd.help.name != 'след')) cmd.run(client, message)
      else return
    }
        
/****************** Проверка правильности ответов ********************/
    if (answer) {
        check = stringSimilarity.compareTwoStrings(message.content.toLowerCase(), answer.toLowerCase()); 
    }

/****************** Если ответ верен - вывод сообщения и подсчет баллов ********************/
    if ((check == 1) && (message.author.bot == false) && (firstAnswer)) {
  //&& (!qNumber) для турнира
        points_write.run(client, message, cmd, answer);
        clearInterval(timerId);
        timerId = false; 
        firstAnswer = false;
     /*   setTimeout(async function(){ 
            let next = await message.channel.send('!старт');
            await next.delete();
        }, 2500);*/
    }

});

client.on('guildMemberAdd', member => {
    const msg = member.guild.channels.get('370921566873059328');
    msg.send({embed:{
    color: 16777215,
    title: "Новый участник!",
    url: "https://fmfan.ru",
    description: "Добро пожаловать, <@" + member.user.id + ">! Для попадания в юниорский состав, пожалуйста, представьтесь и опишите ваш опыт игры в FM в одиночной и, если есть, сетевой игре. Просьба ознакомиться с правилами и возможностями сервера в канале <#502769170400673792>",
    thumbnail: {
      "url": "https://media.giphy.com/media/d2r5afIHy34mWTM8r4/giphy.gif"
    },
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Если вам нужна помощь, просто спросите 🙂"
    }
 }});
 });
client.login(process.env.BOT_TOKEN);
