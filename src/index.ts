import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import {
  USAGE,
  INFO,
  ERROR,
  formatLinks,
  UserState,
  popGlobalState,
  pushGlobalState,
} from "./utils";

// Token stuff.
dotenv.config();
const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error("Cannot find botToken env, exiting.");
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

let globalUserState: Array<UserState> = [];

/*
 * For logging stuff on every message.
 */
bot.on("message", (msg) => {
  const txt = msg.text;
  INFO(`ID: ${msg.chat.id}, username: ${msg.chat.username}, MSG: ${txt}`);
  if (!txt) {
    return;
  }

  if (txt.match(/\/help/) || txt.match(/\/start/)) {
    // Help command.
    bot.sendMessage(msg.chat.id, USAGE);
  } else if (txt.match(/\/sort/)) {
    // Sort Command.
    const userState = popGlobalState(globalUserState, msg.chat.id);
    const sorted = formatLinks(userState.values);
    if (sorted.length <= 0) {
      bot.sendMessage(
        msg.chat.id,
        "Nothing to sort, send links before using sort command.",
      );
      return;
    }

    if (userState.index != -1) {
      // this might look weird, but this IS THE fastest way of emptying an array in javascript.
      globalUserState[userState.index].msg_buffer.length = 0;
    }

    bot.sendMessage(msg.chat.id, sorted);
  } else {
    pushGlobalState(globalUserState, txt, msg.chat.id);
  }
});

/*
 * For logging polling errors
 */
bot.on("polling_error", (error) => {
  ERROR(`${error}`);
});
