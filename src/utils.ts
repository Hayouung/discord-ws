import { OpCode } from "./message/opcodes";

export function payload(op: OpCode, data: any, sequenceNum?: number, eventName?: string): string {
  return JSON.stringify({
    op,
    d: data,
    s: sequenceNum,
    t: eventName
  });
}
