require('dotenv').config();
const {Telegraf} = require('telegraf')
const {mainMenu, backButtonMenu} = require("./utils/buttons");
const {CMD_TEXT} = require("./config/consts");
const {currentWeatherOfString, getCurrentWeather} = require("./services/services");
const express = require('express');

const app = express();

let time;

app.use("/", (req, res) => {
  res.send("Server is running! Start at: " + time);
});

const bot = new Telegraf(process.env.BOT_TOKEN);                   //create object bot

//обработчик команды старт
bot.start((ctx) => {
  ctx.reply(`App ☔ the Weather:\nHello ${ctx.message.from.first_name} ❤, I can show you the weather where you are 📍 💯`, {
    ...mainMenu
  });
});

//прослушиватель на возврат в меню
bot.hears(CMD_TEXT.menu, (ctx) => {
  ctx.reply('Ви у головному меню', {...mainMenu})
});

//прослушиватель на погоду по месту где находишься
bot.hears(CMD_TEXT.weatherI, async (ctx) => {
  const weatherOfString = await currentWeatherOfString();
  if (weatherOfString) {
    ctx.reply(weatherOfString, {...backButtonMenu});
  } else {
    ctx.reply("Sorry we can't get your location 🤷, please send your location");
  }
})

bot.hears(CMD_TEXT.weatherEveryWhere, (ctx) => {
  ctx.reply('Нажаль цей функціонал у меню поки не реалізовано ☺, але скоро буде...)', {...backButtonMenu});
})

//прослушиватель на получение от пользователя геолокации
bot.on('message', async (ctx) => {
  if (ctx.message.location) {
    const {latitude, longitude} = ctx.message.location;
    const weatherOfString = await getCurrentWeather(latitude, longitude);
    ctx.reply(weatherOfString, {...backButtonMenu});
    setTimeout(() => {
      ctx.reply(`Well done ✅`);
    }, 1500);
  }
});

//запуск бота
bot.launch();


app.listen(5000, () => console.log("Server started on PORT 5000"));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

time = new Date().toLocaleString();

console.log(`Bot did started: ${new Date().toLocaleString()}`)
