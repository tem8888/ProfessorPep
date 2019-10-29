const Discord = require('discord.js'); 
const pool = require ('./clientpool.js');  
const config = require('./config.js');
const congrat = require('./congrat.js');
var points;

module.exports.run = async (client, message, cmd, answer) => { 
   let randCongrat = Math.floor(Math.random() * 5) + 1;
        function getPoints(callback) {
                pool.query('SELECT points FROM quiz WHERE id_user = $1', [message.author.id], (err, result) => {
                    if (err) 
                        callback(err,null);
                    else {
                        if (result.rowCount > 0) {
                          callback(null,result.rows[0].points); }
                        else callback(null,0);
                      }
                });
              }
              
           cmd.run().then( hint => {

           switch(hint) { //or false, depends on you case
              case 0:
                 points = (answer.length-1 <= 3) ? 6 : (answer.length-1 <= 5) ? 8 : (answer.length-1 <= 8) ? 10 : (answer.length-1 <= 11) ? 12 : 14;
                 getPoints(async function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                      message.channel.send(`**${message.author.username}**${congrat.noHint[`${randCongrat}`]} заработано **${points} баллов**! Всего: ${total_points+points}\nВыбираю новый вопрос...`);
                  }});
                 break;
              case 1:
                 points = (answer.length-1 <= 3) ? 4 : (answer.length-1 < 5) ? 6 : (answer.length-1 < 8) ? 8 : (answer.length-1 <= 11) ? 10 : 12;
                 getPoints(async function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);          
                     } else {            
                      message.channel.send(`**${message.author.username}**${congrat.hint1[`${randCongrat}`]} получено **${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 2:
                 points = (answer.length-1 <= 3) ? 2 : (answer.length-1 < 5) ? 4 : (answer.length-1 < 8) ? 6 : (answer.length-1 <= 11) ? 8 : 10;
                 getPoints(function(err, total_points) {
                     if (err) {console.log("ERROR : ",err);           
                     } else {            
                       message.channel.send(`**${message.author.username}**${congrat.hint2[`${randCongrat}`]} получено **${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 3:
                 points = (answer.length-1 < 8) ? 4 : (answer.length-1 <= 11) ? 6 : 8;
                getPoints(function(err, total_points) {
                  if (err) {console.log("ERROR : ",err);           
                  } else {            
                    message.channel.send(`**${message.author.username}**${congrat.hint3[`${randCongrat}`]} **+${points} балл(-а,-ов)**! Всего: ${total_points+points}\nДля следующего вопроса введите !след`);
                  }});
                 break;
              case 4:
                 points = (answer.length-1 < 8) ? 2 : (answer.length-1 <= 11) ? 4 : 6;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**${congrat.hint4[`${randCongrat}`]} **+${points} балл(-а,-ов)**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              case 5:
                 points = (answer.length-1 < 8) ? 1 : (answer.length-1 <= 11) ? 2 : 4;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**${congrat.hint5[`${randCongrat}`]} **+${points} балл(-а)**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
               case 6:
                 points = (answer.length-1 <= 11) ? 1 : 2;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**${congrat.hint6[`${randCongrat}`]} **+${points} балл(-а)**! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
                 break;
              default:
                 points = 1;
                 getPoints(function(err, total_points) {
                   if (err) {console.log("ERROR : ",err);           
                   } else {            
                     message.channel.send(`**${message.author.username}**${congrat.moreHint[`${randCongrat}`]} **+${points} балл** в копилку! Всего: ${total_points + points}\nДля следующего вопроса введите !след`);
                 }});
          }
       })
         
          pool.connect( (err, client_db, done) => {
                if (err) throw err
         //pool.query??
                client_db.query(`UPDATE quiz SET count = count + 1, points = points + $1 WHERE id_user = $2`,
                  [points, message.author.id], (err, result) => {
                         done(err);
                        if (result.rowCount == 0){
                         client_db.query('INSERT INTO quiz (id_user, id_guild, name, count, points) VALUES ($1, $2, $3, $4, $5)',
                         [message.author.id, message.member.guild.id, message.author.username, 1, points]);
                    }
                });
              });
           
}

module.exports.help = {
	name: 'points_write'
}