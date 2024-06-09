/*
 *  App level configurations
 */

// development mode, mostly for logging
export const devMode = true;

// type of delimiter to use on each listing
export enum delimiterOptions {
  number, // 1. ... 2. ....
  bullet, // •  ... •  ....
  dash, // -  ... - ....
}
export let delimiter = delimiterOptions.number;

// if this is enabled only valid links will be sorted
// and all other text will be discarded.
export const verifyLinks = true;

// usage help message text.
export const USAGE =
  "USAGE\n\n/sort - Send all links and use this to sort all the given links.\n/help - This help message.";

// Type of an document.
export interface UserState {
  user_id: number;
  msg_buffer: Array<string>;
}

/*
 * Utility function to get current delimiter.
 */
const getDelimiter = (curidx: number) => {
  switch (delimiter) {
    case delimiterOptions.number:
      return `${curidx + 1}. `;
    case delimiterOptions.bullet:
      return "•";
    case delimiterOptions.dash:
      return "-";
  }
};

/*
 * Format text
 */
export const formatLinks = (links: Array<string>): string => {
  return (
    links
      // trim and split text
      .map((l) => l.trim().split(" "))
      // flatten them.
      .flat()
      // filter non-links if verifyLinks flag is enabled.
      .filter((l) => !verifyLinks || URL.canParse(l))
      // reduce to one large string, using delimiter provided.
      .reduce((acc, cur, curidx) => {
        return acc + `${getDelimiter(curidx)} ${cur}\n`;
      }, "")
      // finnally trim edges.
      .trim()
  );
};

/*
 * Utility function to push new or old msg to UserData array.
 */
export const pushGlobalState = (
  globalState: Array<UserState>,
  txt: string,
  userId: number,
) => {
  // first find, and add it if state already exists for current user.
  for (const state of globalState) {
    if (state.user_id === userId) {
      state.msg_buffer.push(txt);
      return;
    }
  }

  // otherwise create new state.
  globalState.push({ user_id: userId, msg_buffer: [txt] });
};

/*
 * Utility function to pop msgs from UserData array.
 */
export const popGlobalState = (
  globalState: Array<UserState>,
  userId: number,
) => {
  for (let i = 0; i < globalState.length; i++) {
    const state = globalState[i];
    if (state.user_id === userId) {
      return { values: state.msg_buffer, index: i };
    }
  }

  return { values: [], index: -1 };
};

/*
 * Logs only in devmode.
 */
export const INFO = (log: string) => {
  if (devMode) {
    console.info(`INFO: ${log}`);
  }
};

/*
 * Logs in all modes.
 */
export const ERROR = (log: string) => {
  console.error(`ERROR: ${log}`);
};
