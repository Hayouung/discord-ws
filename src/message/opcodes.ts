import WebSocket from "ws";

import config from "../../config.json";
import { handleEvent } from "./events";
import { sendHeartbeat, startHeartbeat, acknoledgeHeartbeat } from "../client/heartbeat";
import { Message } from "./messages";
import { payload } from "../utils";
import session from "../client/session";
import { reconnectClient } from "../client/client";

export enum OpCode {
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  STATUS_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  RECONNECT = 7,
  REQUEST_GUILD_MEMBERS = 8,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11
}

export function handleOpCode(message: Message, ws: WebSocket) {
  switch (message.op) {
    case OpCode.DISPATCH:
      return handleEvent(message, ws);
    case OpCode.HEARTBEAT:
      return sendHeartbeat(ws);
    case OpCode.HELLO:
      return hello(message, ws);
    case OpCode.HEARTBEAT_ACK:
      return acknoledgeHeartbeat();
    case OpCode.RECONNECT:
      return reconnectClient(ws);
    case OpCode.INVALID_SESSION:
      throw new Error("Invalid session, please try again.");
    default:
      break;
  }
}

function hello(message: Message, ws: WebSocket): void {
  startHeartbeat(ws, message.d.heartbeat_interval);
  if (session.sequenceNum && session.sessionId) {
    resume(ws);
  } else {
    identify(ws);
  }
}

function identify(ws: WebSocket) {
  console.log("Identifying...");

  ws.send(
    payload(OpCode.IDENTIFY, {
      token: config.token,
      properties: {
        $os: "linux",
        $browser: "disco",
        $device: "disco"
      }
    }),
    err => {
      if (err) console.log(err);
    }
  );
}

function resume(ws: WebSocket) {
  console.log("Attempting to resume...");

  ws.send(
    payload(OpCode.RESUME, {
      token: config.token,
      session_id: session.sessionId,
      seq: session.sequenceNum
    }),
    err => {
      if (err) console.log(err);
    }
  );
}
