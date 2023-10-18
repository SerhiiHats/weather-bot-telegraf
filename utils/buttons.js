const {Markup} = require('telegraf');
const {CMD_TEXT} = require("../config/consts");

const mainMenu =
  Markup.keyboard([
    [CMD_TEXT.weatherI],
    [CMD_TEXT.weatherEveryWhere],
  ]).resize();

const backButtonMenu =
  Markup.keyboard([
    [CMD_TEXT.menu]
  ]).resize()



module.exports = {
  mainMenu,
  backButtonMenu,

};