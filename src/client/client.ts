import axios from "axios";
import WebSocket from "ws";

import config from "../../config.json";
import { Message, handleMessage } from "../message/messages";
import { killHeartbeat } from "./heartbeat";

export async function initClient(): Promise<void> {
  const gateway = await requestGateway();
  const ws = new WebSocket(`${gateway.url}?v=6&encoding=json`);

  ws.on("open", () => {
    console.log("Connected!");
  });

  ws.on("message", (raw: string) => {
    const message: Message = JSON.parse(raw);
    console.log(message.op, message.t, message.s);
    handleMessage(message, ws);
  });

  ws.on("close", () => {
    console.log("Disconnected!");
    killHeartbeat();
  });
}

export function reconnectClient(ws: WebSocket): void {
  console.log("Attempting to reconnect...");

  ws.close();
  initClient();
}

interface GatewayResponse {
  url: string;
}

async function requestGateway(): Promise<GatewayResponse> {
  return axios
    .get<GatewayResponse>("https://discordapp.com/api/gateway/bot", {
      headers: {
        Authorization: `Bot ${config.token}`
      }
    })
    .then(res => res.data);
}
