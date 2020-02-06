const UserModel = require('../models/users.js');

async function top(msg) {
    var name = '';
    var point = '';
    var n = 0;
    UserModel.find({idUserGuild: msg.guild.id}).sort({points:'desc'}).limit(10).then((data)=>{
        if (!data[0]) return msg.channel.send("Таблица лидеров пустая.");
        data.forEach(user => {
            name += `${n+=1}. ${user.name} \n`;
            point += `${user.points_tour} \n`;
        })
        msg.channel.send({embed:{
          color: 0xff9312,
          title: "Турнир окончен. Результаты",
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
     })
};

module.exports = {
    top
};