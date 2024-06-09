"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
dotenv_1.default.config();
const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    console.error("Cannot find botToken env, exiting.");
    process.exit(1);
}
const bot = new node_telegram_bot_api_1.default(botToken, { polling: true });
let globalUserState = [];
bot.on("message", (msg) => {
    const txt = msg.text;
    (0, utils_1.INFO)(`ID: ${msg.chat.id}, username: ${msg.chat.username}, MSG: ${txt}`);
    if (!txt) {
        return;
    }
    if (txt.match(/\/help/) || txt.match(/\/start/)) {
        bot.sendMessage(msg.chat.id, utils_1.USAGE);
    }
    else if (txt.match(/\/sort/)) {
        const userState = (0, utils_1.popGlobalState)(globalUserState, msg.chat.id);
        const sorted = (0, utils_1.formatLinks)(userState.values);
        if (sorted.length <= 0) {
            bot.sendMessage(msg.chat.id, "Nothing to sort, send links before using sort command.");
            return;
        }
        if (userState.index != -1) {
            globalUserState[userState.index].msg_buffer.length = 0;
        }
        bot.sendMessage(msg.chat.id, sorted);
    }
    else {
        (0, utils_1.pushGlobalState)(globalUserState, txt, msg.chat.id);
    }
});
bot.on("polling_error", (error) => {
    (0, utils_1.ERROR)(`${error}`);
});
