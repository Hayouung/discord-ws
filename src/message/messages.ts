import WebSocket from "ws";

import session from "../client/session";
import { handleOpCode, OpCode } from "./opcodes";

export interface Message {
  op: OpCode;
  d: any;
  s?: number;
  t?: string;
}

export function handleMessage(message: Message, ws: WebSocket) {
  if (typeof message.s === "number") {
    session.sequenceNum = message.s;
  }
  handleOpCode(message, ws);
}
