const Discord = require('discord.js');
const client = new Discord.Client();
const pool = require ('./clientpool.js'); 
var points_write = require ('./points.js');  
const config = require('./config.js');
const questions_amount = 120000;
const fs = require('fs');

let answer; let exercise; let question; let randm; let new_name_2 = []; let check; let lines; let timerId;
let hint; let len; let points; let total_points; let firstAnswer; let qNumber; let k;
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
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
          randm = Math.floor(Math.random() * (fullData.length-1)); // -1 из-за последней пустой строки в файле
          quizLine = fullData[randm].split('|'); // строка-массив вопрос|ответ
          question = quizLine[0]; // вопрос
          answer = quizLine[1]; // ответ
          cmd.run(client, message, randm, quizLine, question, answer)
          timerId = true; 
      }
      else if (cmd) cmd.run(client, message)
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
