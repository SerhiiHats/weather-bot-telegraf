const {Markup} = require('telegraf');
const {CMD_TEXT} = require("../text_buttons/consts");

// const mainMenu =
//   Markup.keyboard([
//     [CMD_TEXT.weatherI],
//     [CMD_TEXT.weatherEveryWhere],
//   ]).resize();

const mainMenu = {
  reply_markup: {
    keyboard: [
      [{text: CMD_TEXT.weatherI, request_location: true}],
      [{text: CMD_TEXT.weatherEveryWhere}],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }
}
// Markup.keyboard([
//   [CMD_TEXT.weatherI],
//   [CMD_TEXT.weatherEveryWhere],
// ]).resize();

const sendCityMenu = {
  reply_markup: {
    keyboard: [
      [{text: CMD_TEXT.sendNameCity}],
    ],
    resize_keyboard: true,
  }
}

const backButtonMenu = {
  reply_markup: {
    keyboard: [
      [{text: CMD_TEXT.menu}],
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
}

// Markup.keyboard([
//   [CMD_TEXT.menu]
// ]).resize()


module.exports = {
  mainMenu,
  backButtonMenu,
  sendCityMenu,
};