/*
- Обнуление добавить +++++++++++
- Топы добавить +++++++++++++
- Турнирный режим добавить
- ХЕЛП добавить
- статистика по гильдиям

*/
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.js');
const Enmap = require("enmap");
const fs = require('fs');

const mongoose = require('mongoose');

(async() => {
  //
  await mongoose.connect('mongodb://heroku_hgp9vjmn:can1bouegq4nrbvnjrl0niios7@ds217099.mlab.com:17099/heroku_hgp9vjmn',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => {
        console.log("Connected to the Mongodb database.");
        return bot.login(process.env.BOT_TOKEN);
    }).catch((err) => {
     //   bot.logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });;
})()

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
        bot.commands.set(props.help.name, props)
       })
})

bot.config = config;
bot.commands = new Enmap();

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      bot.on(eventName, event.bind(null, bot));
    });
});


//bot.login(config.botToken);
