const Discord = require('discord.js');
var pool = require ('../clientpool.js');  
const config = require('../config.js');

module.exports.run = async (client, message) => { 
    pool.connect( (err, client_db, done) => {
          if (err) throw err
          var name = '';
          var point = '';
          var n = 0;
          client_db.query('SELECT name, points FROM quiz WHERE id_guild = $1 ORDER BY points DESC LIMIT 10',[message.member.guild.id], (err, res) => {
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
              "value": `**${name}**`,
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

module.exports.help = {
	name: 'топ'
}