// Добавить нового игрока, обнуляется при новом ответе

const Discord = require('discord.js'); 
const pool = require ('../clientpool.js');  
const config = require('../config.js');
const congrat = require('./congrat.js');
const UserModel = require('../models/users.js');
const GuildModel = require('../models/guild.js');
let addPoints;

module.exports.run = async (client, message, answer, hint) => { 
   // await UserModel.findOneAndUpdate({idUser: message.author.id}, {$set: {idUser: message.author.id, name:  message.author.username, answersCount: 0, points: 0}}, {upsert: true, new: true, runValidators: true});
    let randCongrat = Math.floor(Math.random() * 5) + 1;
    switch(hint) { 
        case 0:
            addPoints = (answer.length-1 <= 3) ? 6 : (answer.length-1 <= 5) ? 8 : (answer.length-1 <= 8) ? 10 : (answer.length-1 <= 11) ? 12 : 14;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name: message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then( (user) => {
                message.channel.send(`**${user.name}**${congrat.noHint[`${randCongrat}`]} заработано **${addPoints} баллов**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            })
            break;
        case 1:
            addPoints = (answer.length-1 <= 3) ? 4 : (answer.length-1 < 5) ? 6 : (answer.length-1 < 8) ? 8 : (answer.length-1 <= 11) ? 10 : 12;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint1[`${randCongrat}`]} получено **${addPoints} балл(-а,-ов)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            })  
             break;
        case 2:
            addPoints = (answer.length-1 <= 3) ? 2 : (answer.length-1 < 5) ? 4 : (answer.length-1 < 8) ? 6 : (answer.length-1 <= 11) ? 8 : 10;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint2[`${randCongrat}`]} получено **${addPoints} балл(-а,-ов)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            });
            break;
        case 3:
            addPoints = (answer.length-1 < 8) ? 4 : (answer.length-1 <= 11) ? 6 : 8;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint3[`${randCongrat}`]} **+${addPoints} балл(-а,-ов)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            });
            break;
        case 4:
            addPoints = (answer.length-1 < 8) ? 2 : (answer.length-1 <= 11) ? 4 : 6;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint4[`${randCongrat}`]} **+${addPoints} балл(-а,-ов)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
             });
             break;
        case 5:
            addPoints = (answer.length-1 < 8) ? 1 : (answer.length-1 <= 11) ? 2 : 4;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint5[`${randCongrat}`]} **+${addPoints} балл(-а)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            });
             break;
        case 6:
            addPoints = (answer.length-1 <= 11) ? 1 : 2;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.hint6[`${randCongrat}`]} **+${addPoints} балл(-а)**! Всего: ${user.points}\n\nВыбираю новый вопрос...`);
            });
             break;
        default:
            addPoints = 1;
            await UserModel.findOneAndUpdate({idUser: message.author.id},
                {
                    $set: {idUser: message.author.id, idUserGuild: message.guild.id, name:  message.author.username},
                    $inc : {points: addPoints, answersCount: 1}
                },{ new: true, upsert: true })
            .then((user)=>{
                message.channel.send(`**${user.name}**${congrat.moreHint[`${randCongrat}`]} **+${addPoints} балл** в копилку! Всего: ${user.points + addPoints}\n\nВыбираю новый вопрос...`);
            });
    }
    await GuildModel.findOneAndUpdate({idGuild: message.guild.id}, {$inc : {points: addPoints, answersCount: 1}});      
}

module.exports.help = {
  name: 'showCongrat'
}