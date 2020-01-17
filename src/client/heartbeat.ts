import WebSocket from "ws";

import session from "./session";
import { payload } from "../utils";
import { OpCode } from "../message/opcodes";
import { reconnectClient } from "./client";

let interval: NodeJS.Timeout;
let acked: boolean;

export function startHeartbeat(ws: WebSocket, heartbeatInterval: number): void {
  // acknoledge first so we can send the very first heartbeat without reconnecting
  acknoledgeHeartbeat();
  interval = setInterval(() => {
    sendHeartbeat(ws);
  }, heartbeatInterval);
}

export function killHeartbeat(): void {
  if (interval) {
    clearInterval(interval);
  }
}

export function sendHeartbeat(ws: WebSocket) {
  if (!acked) {
    console.error("Previous heartbeat was not acked.");
    return reconnectClient(ws);
  }

  console.log("Sending heartbeat...", session.sequenceNum);
  ws.send(payload(OpCode.HEARTBEAT, session.sequenceNum), err => {
    if (err) console.error(err);
  });
  acked = false;
}

export function acknoledgeHeartbeat() {
  acked = true;
}
