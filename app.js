const Discord = require('discord.js');
const client = new Discord.Client();
const { Pool } = require ('pg');    
const pool = new Pool({
        port: 5432,
        host: "ec2-54-247-171-30.eu-west-1.compute.amazonaws.com",
        database: "d7qglb2p2tfh1r",
        user: "bwcvyvshzsuuqm",
        password: "10072d3367cbf49aa08b89c769beb473f18c5965ee44434898c44adacfd90551",
        ssl: true 
});

prefix = '!';
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
            });
  pool.connect(err => {
  if(err) throw err; 
  console.log('Connected to PostgresSQL'); });

 });

var stringSimilarity = require('string-similarity');

//---------------------
// CLIENT.ON MESSAGE =>
//---------------------
client.on("message", (message) => {
if (message.channel.id === '631799183996747786') {
  if(message.author.bot == false) 
  {
    var fs = require('fs');
    var data = fs.readFileSync('questions.txt', 'utf8');
    lines = data.split('\n');
    //question = lines.split('|');
    //console.log(lines[2]);
  }
        

 if (message.content.startsWith("!топ")) {
     pool.connect( (err, client_db, done) => {
          if (err) throw err
          var name = '';
          var point = '';
          var n = 0;
          client_db.query('SELECT name, points FROM quiz ORDER BY points DESC LIMIT 10', (err, res) => {
                done(err);
                const data = res.rows;
                data.forEach(row => {
                name += `${n+=1}. ${row.name} \n`;
                point += `${row.points} \n`;
            })
          message.channel.send({embed:{
          color: 0xff9312,
          title: "Топ пользователей викторины",
          fields: [
            {
              "name": 'Ник',
              "value": `${name}`,
              "inline": true
            },
            {
              "name": 'Баллы',
              "value": `${point}`,
              "inline": true
            }
            ]      
          }});
           });
        })
 }
  if (message.content.startsWith("!тур")) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    qNumber = args[0]; k = 1; //k - счетчик вопросов в турнирном режиме; qNumber - число вопросов
    message.channel.send(`Турнирный режим on. Вопросов: ${qNumber}. Для старта введите !след`);
} else
if (message.content.startsWith("!офф")) {
    qNumber = 0; k = 0;
    pool.query('UPDATE quiz_tournament SET points = 0', (err, result) => {});
    message.channel.send(`Турнирный режим off.`);
}
  if ((message.content.startsWith("!старт") || message.content.startsWith("!след")) && (!timerId)) // нельзя повторно вызывать этот кусок кода, пока он не выполнился до конца
  {   
     firstAnswer = true;     
     randm = Math.floor(Math.random() * 15900) ; //34010
     exercise = lines[randm].split('|');
     question = exercise[0]
     answer = exercise[1];
     len = answer.length - 1;
     if (!qNumber) message.channel.send(`\`\`\`fix
  ${question}, букв: ${len}\`\`\``);
      else message.channel.send(`\`\`\`ini
[Вопрос №${k}: ${question}, букв: ${len}]\`\`\``);
    console.log('ответ= '+answer);
     var new_name_2 = [];

  function get_line(filename, line_no, callback) 
   {
      if(+line_no > lines.length){
        throw new Error('File end reached without finding line');
      }
      callback(null, lines[+line_no]); 
   }

  String.prototype.replaceAt=function(index, replacement) 
   {
      return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
   }

  get_line('questions.txt', randm, function(err, line)   // получаем рандомную строку со словом из файла
   { 
      let exer = line.split('|');
      let answ = exer[1];
      var new_name = answ.replace(/([А-ЯЁа-яёa-z])/gi,'•'); // замещаем все слово звездочками *
      var id_index_array = []; // создаем массив для рандомных ключей
// Генерируем уникальные индексы для открываемых букв
  function generateRandom(min, max) { 
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (id_index_array.length != len) { // выходим из функции, если длина массива равна длине слова
    return (id_index_array.includes(num)) ? generateRandom(min, max) : num;}
  }
  
  for (i=0; i<len-1; i++) { // цикл для собирания и открывания случайных букв
      rand_index_2 = generateRandom(0, len-1); // возвращаем из функции уникальные значения индексов
      id_index_array.push(rand_index_2); // пушим их в массив
      new_name = new_name.replaceAt(rand_index_2, ""+answer[rand_index_2]+""); // заменяем звездочки на буквы
      new_name_2.push(new_name); // пушим поочередные слова с открытыми буквами в массив
  }

  pod = new_name_2;
  console.log('length='+len); 
  hint = 0;
 // message.channel.send(`Подсказка №${j}: ${pod[0]}`);

  timerId = setInterval(function next() {
      if (pod[hint+1]) {
        message.channel.send(`> Подсказка №${hint+1}: ${pod[hint]}`);
        hint += 1;
      } else {
          clearInterval(timerId);
          timerId = false; 
          message.channel.send(`Слабаки, правильный ответ: ${answer}\nДля следующего вопроса введите !след`);
              firstAnswer = false;
              k += 1;
    //  setTimeout(function(){message.channel.send('!next')}, 2000); 
      }
  }, 8000);

});
}
     
if (answer) {
  check = stringSimilarity.compareTwoStrings(message.content, answer); 
}

if ((check == 1) && (message.author.bot == false) &&(firstAnswer) && (!qNumber)) {
        firstAnswer = false;
        function getPoints(callback) {
                pool.query('SELECT points FROM quiz WHERE id = $1', [message.author.id], (err, result) => {
                    if (err) 
                        callback(err,null);
                    else {
                        if (result.rowCount > 0) {
                          callback(null,result.rows[0].points); }
                        else callback(null,0);
                      }
                });
              }
            
           switch(hint) { //or false, depends on you case
              case 0:
                 points = (answer.length-1 < 5) ? 8 : (answer.length-1 < 8) ? 10 : 12;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                      message.channel.send(`**${message.author.username}** обезумел и ответил без подсказок! заработано **${points} баллов**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 1:
                 points = (answer.length-1 < 5) ? 6 : (answer.length-1 < 8) ? 8 : 10;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);          
                     } else {            
                      message.channel.send(`**${message.author.username}** немного подумав, ответил верно! заработано **${points} баллов**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 2:
                 points = (answer.length-1 < 5) ? 4 : (answer.length-1 < 8) ? 6 : 8;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                       message.channel.send(`**${message.author.username}** воспользовался подсказками и дал правильный ответ! заработано **${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 3:
                 points = (answer.length-1 < 8) ? 4 : 6;
                getPoints(function(err, total_points) {
                  if (err) {console.log("ERROR : ",err);           
                  } else {            
                    message.channel.send(`Было сложно, но **${message.author.username}** справился! **+${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 4:
                 points = (answer.length-1 < 8) ? 2 : 4;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}** из последних сил угадывает ответ! **+${points} балла**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              case 5:
                 points = (answer.length-1 < 8) ? 1 : 2;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}** методом тыка все же угадал ответ! **+${points} балл(-а)**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              default:
                 points = 1;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**, ну конечно! **+${points} балл** в копилку! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
          }
          clearInterval(timerId);
          timerId = false; 
         // setTimeout(async function(){message.channel.send('!next')}, 2000);
          pool.connect( (err, client_db, done) => {
                if (err) throw err
                pool.query('UPDATE quiz SET count = count + 1, points = points + $1 WHERE id = $2', [points, message.author.id], (err, result) => {
                         done(err);
                        if (result.rowCount == 0){
                         client_db.query('INSERT INTO quiz (id, name, count, points) VALUES ($1, $2, $3, $4)',
                         [message.author.id, message.author.username, 1, points]);
                    }
                });
              });
}
 if ((check == 1) && (message.author.bot == false) && (firstAnswer) && (qNumber)) {
        firstAnswer = false; 
        function getPoints(callback) {
                pool.query('SELECT points FROM quiz_tournament WHERE id = $1', [message.author.id], (err, result) => {
                    if (err) 
                        callback(err,null);
                    else {
                        if (result.rowCount > 0) {
                          callback(null,result.rows[0].points); }
                        else callback(null,0);
                      }
                });
              }
            
           switch(hint) { //or false, depends on you case
              case 0:
                 points = (answer.length-1 < 5) ? 8 : (answer.length-1 < 8) ? 10 : 12;
                 k += 1;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                      message.channel.send(`**${message.author.username}** обезумел и ответил без подсказок! заработано **${points} баллов**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 1:
                 points = (answer.length-1 < 5) ? 6 : (answer.length-1 < 8) ? 8 : 10;
                 k += 1;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);          
                     } else {            
                      message.channel.send(`**${message.author.username}** немного подумав, ответил верно! заработано **${points} баллов**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 2:
                 points = (answer.length-1 < 5) ? 4 : (answer.length-1 < 8) ? 6 : 8;
                 k += 1;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                       message.channel.send(`**${message.author.username}** воспользовался подсказками и дал правильный ответ! заработано **${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 3:
                 points = (answer.length-1 < 8) ? 4 : 6;
                 k += 1;
                getPoints(function(err, total_points) {
                  if (err) {console.log("ERROR : ",err);           
                  } else {            
                    message.channel.send(`Было сложно, но **${message.author.username}** справился! **+${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 4:
                 points = (answer.length-1 < 8) ? 2 : 4;
                 k += 1;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}** из последних сил угадывает ответ! **+${points} балла**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              case 5:
                 points = (answer.length-1 < 8) ? 1 : 2;
                 k += 1;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}** методом тыка все же угадал ответ! **+${points} балл(-а)**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              default:
                 points = 1;
                 k += 1;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**, ну конечно! **+${points} балл** в копилку! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
          }

         // console.log(hint);
          clearInterval(timerId);
          timerId = false; 
         // setTimeout(async function(){message.channel.send('!next')}, 2000);
          pool.connect( (err, client_db, done) => {
                if (err) throw err
                pool.query('UPDATE quiz_tournament SET count = count + 1, points = points + $1 WHERE id = $2', [points, message.author.id], (err, result) => {
                         done(err);
                        if (result.rowCount == 0){
                         client_db.query('INSERT INTO quiz_tournament (id, name, count, points) VALUES ($1, $2, $3, $4)',
                         [message.author.id, message.author.username, 1, points]);
                    }
                });
              });
} else
if (k > qNumber) {
  console.log(k);
  console.log(qNumber);
     pool.connect( async function (err, client_db, done) {
          if (err) throw err
          var name = '';
          var point = '';
          var n = 0;
          k = 1;
          await client_db.query('SELECT name, points FROM quiz_tournament ORDER BY points DESC LIMIT 10', (err, res) => {
                done(err);
                const data = res.rows;
                data.forEach(row => {
                name += `${n+=1}. ${row.name} \n`;
                point += `${row.points} \n`;
            })
          message.channel.send({embed:{
          color: 0xff9312,
          title: "Турнир окончен, результаты:",
          fields: [
            {
              "name": 'Ник',
              "value": `${name}`,
              "inline": true
            },
            {
              "name": 'Баллы',
              "value": `${point}`,
              "inline": true
            }
            ]      
          }});
           });
        });
       }
}
});

client.on('guildMemberAdd', member => {
    const msg = member.guild.channels.get('382112544523026435');
    msg.send({embed:{
    color: 16777215,
    title: "Новый участник!",
    url: "https://fmfan.ru",
    description: "Добро пожаловать, <@" + member.user.id + ">! Для получения фан-статуса, пожалуйста, представьтесь и опишите ваш опыт игры в FM в одиночной и сетевой игре. Просьба ознакомиться с правилами и возможностями сервера в канале <#502769170400673792>",
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
