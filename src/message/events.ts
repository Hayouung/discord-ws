import WebSocket from "ws";

import { Message } from "./messages";
import session from "../client/session";

export function handleEvent(message: Message, _ws: WebSocket): void {
  switch (message.t) {
    case "READY":
      return ready(message);
    case "RESUMED":
      return console.log("Successfully resumed!");
    case "MESSAGE_CREATE":
      return console.log(message.d);
    default:
      break;
  }
}

function ready(message: Message): void {
  session.sessionId = message.d.session_id;
}
