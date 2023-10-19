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

const index = new Telegraf(process.env.BOT_TOKEN);                   //create object index

//обработчик команды старт
index.start((ctx) => {
  ctx.reply(`App ☔ the Weather:\nHello ${ctx.message.from.first_name} ❤, I can show you the weather where you are 📍 💯`, {
    ...mainMenu
  });
});

//прослушиватель на возврат в меню
index.hears(CMD_TEXT.menu, (ctx) => {
  ctx.reply('Ви у головному меню', {...mainMenu})
});

//прослушиватель на погоду по месту где находишься
index.hears(CMD_TEXT.weatherI, async (ctx) => {
  const weatherOfString = await currentWeatherOfString();
  if (weatherOfString) {
    ctx.reply(weatherOfString, {...backButtonMenu});
  } else {
    ctx.reply("Sorry we can't get your location 🤷, please send your location");
  }
})

index.hears(CMD_TEXT.weatherEveryWhere, (ctx) => {
  ctx.reply('Нажаль цей функціонал у меню поки не реалізовано ☺, але скоро буде...)', {...backButtonMenu});
})

//прослушиватель на получение от пользователя геолокации
index.on('message', async (ctx) => {
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
index.launch();


app.listen(5000, () => console.log("Server started on PORT 5000"));

// Enable graceful stop
process.once('SIGINT', () => index.stop('SIGINT'))
process.once('SIGTERM', () => index.stop('SIGTERM'))

time = new Date().toLocaleString();

console.log(`Bot did started: ${new Date().toLocaleString()}`)
