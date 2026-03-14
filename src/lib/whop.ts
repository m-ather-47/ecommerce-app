import "server-only";
import Whop from "@whop/sdk";

let _client: Whop | null = null;

export function getWhopClient(): Whop {
  if (!_client) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error("WHOP_API_KEY environment variable is not set");
    }
    _client = new Whop({ apiKey: process.env.WHOP_API_KEY });
  }
  return _client;
}

export const whop = new Proxy({} as Whop, {
  get(_target, prop, receiver) {
    const instance = getWhopClient();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
