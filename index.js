require('dotenv').config();
const {Telegraf} = require('telegraf');
const express = require('express');
const {mainMenu, backButtonMenu, sendCityMenu} = require("./src/bot_buttons/keyboard/keyBoardButtons");
const {CMD_TEXT} = require("./src/bot_buttons/text_buttons/consts");
const {currentWeatherOfString, getCurrentWeather, getCitiesFromGeocoder} = require("./src/services/services");
const {inlineButtonSendYourCity, inlineButtonsOfCity} = require("./src/bot_buttons/inlineKeyBoard/inlineKeyboard");

const PORT = 5000;
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Server running at ${new Date().toLocaleString()} on http://localhost:${PORT}`);
})

if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');

const index = new Telegraf(process.env.BOT_TOKEN);                   //create object index

//обработчик команды старт
index.start((ctx) => {
  const chatId = ctx.message.chat.id;
  ctx.reply(`App ☔ the Weather:\nHello ${ctx.message.from.first_name} ❤, I can show you the weather where you are 📍 💯
This only works if geolocation is enabled`, {...inlineButtonSendYourCity});
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

index.hears(CMD_TEXT.sendNameCity, (ctx) => {
  ctx.reply("Excellent!!! You entered the name of the city, but I didn't receive anything, please try again");
})

index.hears(CMD_TEXT.weatherEveryWhere, async (ctx) => {
  return ctx.reply("Напиши назву твого міста", {...sendCityMenu})
})

//прослушиватель на получение от пользователя геолокации
index.on('message', async (ctx) => {
  if (ctx.message.location) {
    const {latitude, longitude} = ctx.message.location;
    const weatherOfString = await getCurrentWeather(latitude, longitude);
    return ctx.reply(weatherOfString, {...backButtonMenu})
      .then(() => {
        setTimeout(() => {
          ctx.reply(`Well done ✅`);
        }, 1500);
      });
  }

  const city = ctx.update.message.text;

  if (city && city.trim().length < 3) {
    return ctx.reply(`Повинно бути більше 2 символів ❌ ${city.trim()}`);
  } else {
    const userCities = await getCitiesFromGeocoder(city.trim());

    return ctx.reply(`Well done ✅ ${userCities.map(city => {
      return city.state ? `${city.name} ${city.state} ${city.country}` : `${city.name} ${city.country}`;
    }).join(", ")}
👉 Вибери свое місто 💛💙`, {...inlineButtonsOfCity(userCities)});
  }

});


index.on('callback_query', async (ctx) => {
  const {data} = ctx.update.callback_query;

  if (data === CMD_TEXT.sendCity) {
    return ctx.reply("Напиши назву твого міста", {...sendCityMenu})
  }

  const {lat, lon} = JSON.parse(data);
  const weatherOfString = await getCurrentWeather(lat, lon);
  return ctx.reply(weatherOfString, {...backButtonMenu})
    .then(() => {
      setTimeout(() => {
        ctx.reply(`Well done ✅`);
      }, 1500);
    });
})

//запуск бота
index.launch();

// Enable graceful stop
process.once('SIGINT', () => index.stop('SIGINT'))
process.once('SIGTERM', () => index.stop('SIGTERM'))

console.log(`Bot did started: ${new Date().toLocaleString()}`)
