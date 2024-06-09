"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = exports.INFO = exports.popGlobalState = exports.pushGlobalState = exports.formatLinks = exports.USAGE = exports.verifyLinks = exports.delimiter = exports.delimiterOptions = exports.devMode = void 0;
exports.devMode = true;
var delimiterOptions;
(function (delimiterOptions) {
    delimiterOptions[delimiterOptions["number"] = 0] = "number";
    delimiterOptions[delimiterOptions["bullet"] = 1] = "bullet";
    delimiterOptions[delimiterOptions["dash"] = 2] = "dash";
})(delimiterOptions || (exports.delimiterOptions = delimiterOptions = {}));
exports.delimiter = delimiterOptions.number;
exports.verifyLinks = true;
exports.USAGE = "USAGE\n\n/sort - Send all links and use this to sort all the given links.\n/help - This help message.";
const getDelimiter = (curidx) => {
    switch (exports.delimiter) {
        case delimiterOptions.number:
            return `${curidx + 1}. `;
        case delimiterOptions.bullet:
            return "•";
        case delimiterOptions.dash:
            return "-";
    }
};
const formatLinks = (links) => {
    return (links
        .map((l) => l.trim().split(" "))
        .flat()
        .filter((l) => !exports.verifyLinks || URL.canParse(l))
        .reduce((acc, cur, curidx) => {
        return acc + `${getDelimiter(curidx)} ${cur}\n`;
    }, "")
        .trim());
};
exports.formatLinks = formatLinks;
const pushGlobalState = (globalState, txt, userId) => {
    for (const state of globalState) {
        if (state.user_id === userId) {
            state.msg_buffer.push(txt);
            return;
        }
    }
    globalState.push({ user_id: userId, msg_buffer: [txt] });
};
exports.pushGlobalState = pushGlobalState;
const popGlobalState = (globalState, userId) => {
    for (let i = 0; i < globalState.length; i++) {
        const state = globalState[i];
        if (state.user_id === userId) {
            return { values: state.msg_buffer, index: i };
        }
    }
    return { values: [], index: -1 };
};
exports.popGlobalState = popGlobalState;
const INFO = (log) => {
    if (exports.devMode) {
        console.info(`INFO: ${log}`);
    }
};
exports.INFO = INFO;
const ERROR = (log) => {
    console.error(`ERROR: ${log}`);
};
exports.ERROR = ERROR;
