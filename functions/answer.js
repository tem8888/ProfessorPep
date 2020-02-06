const fs = require('fs');
const path = require("path");

let fullData = fs.readFileSync(path.join(__dirname, '../questions.txt'),'utf8').split('\n');

function getLine () {
	let funcResult = [];
	randm = Math.floor(Math.random() * (fullData.length-1)); // -1 из-за последней пустой строки в файле
	quizLine = fullData[randm].split('|'); // строка-массив вопрос|ответ
	question = quizLine[0]; // вопрос
	answer = quizLine[1]; // ответ
	funcResult.push(randm, question, answer);
	return funcResult;
};

module.exports = {
    getLine
};