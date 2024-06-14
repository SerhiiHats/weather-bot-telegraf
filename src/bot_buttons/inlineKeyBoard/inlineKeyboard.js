const {CMD_TEXT} = require("../text_buttons/consts");

const inlineButtonSendYourCity = {
  reply_markup: {
    inline_keyboard: [
      [{text: CMD_TEXT.sendCity, callback_data: CMD_TEXT.sendCity}],
    ],
  }
};

const inlineButtonsOfCity = (cities) => {
  const arrayInlineKeyboard = cities.map(city => {
    const localName = city?.local_names?.uk ? city.local_names.uk : city.name;
    const nameCity = city.state ? `${localName} ${city.state} ${city.country}` : `${localName} ${city.country}`;
    return [
      {
        text: nameCity,
        callback_data: JSON.stringify({lat: city.lat, lon: city.lon}),
      }
    ]
  })

  return {
    reply_markup: {
      inline_keyboard: [
        ...arrayInlineKeyboard
      ],
    }
  }
};

module.exports = {
  inlineButtonSendYourCity,
  inlineButtonsOfCity
};

