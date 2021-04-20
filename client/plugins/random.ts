import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

interface PluginRandom {
  uuid(): string;
  string(length: number): string;
  number(length: number): number;
  password(length: number): string;
}

export class Random implements PluginRandom {
  private numBase: string;
  private passwordBase: string;

  constructor() {
    this.numBase = "1234567890";
    this.passwordBase =
      "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  uuid(): string {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
        case "x":
          chars[i] = Math.floor(Math.random() * 16)
            .toString(16)
            .toUpperCase();
          break;
        case "y":
          chars[i] = (Math.floor(Math.random() * 4) + 8)
            .toString(16)
            .toUpperCase();
          break;
      }
    }
    return chars.join("");
  }

  string(length: number = 16): string {
    return (
      new Date().getTime().toString(length) +
      Math.floor(1000 * Math.random()).toString(length)
    ).toUpperCase();
  }

  number(length: number = 16): number {
    let num = "";
    for (let i = 0; i < length; i++) {
      num += this.numBase.charAt(
        Math.floor(Math.random() * this.numBase.length)
      );
    }
    return +num;
  }

  password(length: number = 12): string {
    let password = "";
    for (let i = 0; i < length; i++) {
      password += this.passwordBase.charAt(
        Math.floor(Math.random() * this.passwordBase.length)
      );
    }
    return password;
  }
}

export default (_ctx: Context, inject: Inject) => {
  inject("rand", new Random());
};

declare module "@nuxt/types" {
  interface Context {
    $rand: PluginRandom;
  }
}
