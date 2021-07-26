//const active = new Map();
//const talkedRecently = new Set();
const config = require('../config.js')
const fs = require('fs')
const path = require('path')
const UserModel = require('../models/users.js')
const GuildModel = require('../models/guild.js')
const GetQuizLine = require('../functions/answer.js')
const GetHints = require('../functions/interval.js')
let stringSimilarity = require('string-similarity')
const next = require('../quiz/next.js')
let showCongrat = require('../quiz/points.js')
let showCongratTour = require('../quiz/points_tour.js')
const GetTop = require('../functions/top_tour.js')
let snekfetch = require('snekfetch')
const congrat = require('../quiz/congrat.js')
let firstAnswer
let questionInProgress = false
let check
let k = 0
let qNumber
let randCongrat

module.exports = async (client, msg) => {
  if (msg.guild === null) return // Реагируем только на сообщения на серверах, пропускаем сообщения в DM

  /********** Если ответ существует, сравниваем и возвращаем 1 если он совпадает с сообщением ********/
  if (typeof quizLine !== 'undefined' && questionInProgress) {
    // Существует ли такая переменная QuizLine?
    check = stringSimilarity.compareTwoStrings(
      msg.content.toLowerCase(),
      answer.toLowerCase()
    )
  }

  /****************** Если ответ верен - вывод сообщения и подсчет баллов ********************/
  if (check == 1 && firstAnswer) {
    // ТУРНИРНЫЙ РЕЖИМ
    if (qNumber) {
      GetHints.interval() // прерываем появление подсказок
      showCongratTour.run(client, msg, answer, hint).then(() => {
        if (k < qNumber) msg.channel.send('Выбираю новый вопрос...')
      })

      firstAnswer = false
      k += 1

      if (k >= qNumber)
        return GetTop.top(msg).then(() => {
          // если это был последний вопрос турнира, то возвращаем итоговую таблицу
          questionInProgress = false
        })

      setTimeout(async function () {
        firstAnswer = true
        GetQuizLine.getLine() // Из answer.js получаю номер строки, вопрос и ответ

        next
          .run(client, msg, question, answer, qNumber, k)
          .then(async (hintArray) => {
            await GetHints.interval(msg, hintArray, qNumber).then(async () => {
              // Срабатывает только когда на вопрос не был дан правильный ответ
              msg.channel.send(
                `${congrat.noAnswer[`${randCongrat}`]} **${answer}**`
              )
              ;(qNumber = 0), (k = 0) // на последнем вопросе отключаем турнир
              GetTop.top(msg)
              questionInProgress = false
            })
          })
          .catch((err) => console.log(err))
      }, 4000)
      return
    }

    // ОБЫЧНЫЙ РЕЖИМ
    GetHints.interval() // прерываем появление подсказок
    showCongrat.run(client, msg, answer, hint)
    firstAnswer = false

    setTimeout(async function () {
      firstAnswer = true
      GetQuizLine.getLine() // Из answer.js получаю номер строки, вопрос и ответ

      next
        .run(client, msg, question, answer)
        .then(async (hintArray) => {
          await GetHints.interval(msg, hintArray).then(async () => {
            // Срабатывает только когда на вопрос не был дан правильный ответ
            msg.channel.send(
              `${congrat.noAnswer[`${randCongrat}`]} **${answer}**`
            )
            let noAnswerVote = await msg.channel.send(`_ _\nГо дальше?`)
            await noAnswerVote.react('🆗')
            questionInProgress = false
          })
        })
        .catch((err) => console.log(err))
    }, 4000)
  }

  GuildModel.findOne({ idGuild: msg.guild.id })
    .then(async (guild) => {
      let prefix = guild.prefix

      // Пропускаем сообщения без префикса
      if (msg.content.indexOf(prefix) !== 0) return

      let checkBotStart = stringSimilarity.compareTwoStrings(
        msg.content,
        `${prefix}старт`
      )
      if (msg.author.bot && checkBotStart !== 1) return // Пропускаем все сообщения бота кроме команды старта следующего вопроса
      if (msg.author.bot && checkBotStart === 1) questionInProgress = false

      // Команды настроек викторины работающие во всех каналах
      let content = msg.content.split(' ')
      let command = content[0]
      let args = content.slice(1)

      if (command.startsWith(prefix)) {
        let commandfile = client.commands.get(command.slice(prefix.length))
        if (commandfile)
          commandfile.run(client, msg, args).then((qNum) => {
            if (Number.isInteger(Number(qNum))) {
              if (Number(qNum === 0)) k = 0
              qNumber = qNum
              return
            }
          })
      }

      if (msg.channel.id != guild.channelId) {
        if (guild.channelId) {
          msg.channel.send(
            `Викторина работает в этом канале <#${guild.channelId}>.`
          )
        } else {
          msg.channel.send(
            `Установите канал для работы викторины через команду [${prefix}]channel ID_канала. (только для админов)`
          )
        }
        return
      }

      if (msg.content === `${prefix}старт` && !questionInProgress) {
        randCongrat = Math.floor(Math.random() * 5) + 1
        questionInProgress = true
        firstAnswer = true

        GetQuizLine.getLine() // Из answer.js получаю номер строки, вопрос и ответ

        next
          .run(client, msg, question, answer, qNumber, k)
          .then(async (hintArray) => {
            await GetHints.interval(msg, hintArray, qNumber).then(
              async (qcount) => {
                // Срабатывает только когда на вопрос не был дан правильный ответ

                if (!qNumber) {
                  // если турнира нет и ответ не угадан
                  msg.channel.send(
                    `${congrat.noAnswer[`${randCongrat}`]} **${answer}**`
                  )
                  let noAnswerVote = await msg.channel.send(`Го дальше?`)
                  await noAnswerVote.react('🆗')
                  k = 0
                } else {
                  // если турнир есть и ответ не угадан
                  k += qcount
                  msg.channel.send(
                    `${congrat.noAnswer[`${randCongrat}`]} **${answer}**`
                  )
                  if (k < qNumber) {
                    // если это не последний вопрос в турнире
                    msg.channel.send(`Выбираю новый вопрос 🙇‍♂️`)
                    setTimeout(async function () {
                      let skipNext = await msg.channel.send('!старт')
                      await skipNext.delete()
                    }, 4000)
                  } else {
                    ;(qNumber = 0), (k = 0) // на последнем вопросе отключаем турнир
                    GetTop.top(msg)
                  }
                }
                questionInProgress = false
              }
            )
          })
          .catch((err) => console.log(err))
      }

      if (msg.content.startsWith(`${prefix}обнулить`)) {
        if (!msg.member.hasPermission('MANAGE_GUILD'))
          return msg.channel.send('Это может сделать только админ сервера.')
        UserModel.updateMany({ idUserGuild: msg.guild.id }, { points: 0 }).then(
          () => {
            msg.channel.send('Очки викторины обнулены.')
          }
        )
      }
      if (msg.content.startsWith(`${prefix}upl`)) {
        let txt_url = ''
        let Attachment = msg.attachments.array()
        if (Attachment != '') txt_url = Attachment[0].url
        // msg.delete();

        if (txt_url !== '' && txt_url.slice(-3) === 'txt')
          snekfetch.get(txt_url).then(async (r) => {
            fullData = r.body.toString().split(`\n`)
            msg.channel.send(
              `Загружен список из **${fullData.length}** вопросов`
            )
          })
      }
      if (msg.content.startsWith(`${prefix}default`)) {
        fullData = fs
          .readFileSync(path.join(__dirname, '../new-file.txt'), 'utf8')
          .split('\n')
        msg.channel.send(
          `Загружен дефолтный список из **${fullData.length}** вопросов`
        )
      }
    })
    .catch((err) => console.log(err))
}
