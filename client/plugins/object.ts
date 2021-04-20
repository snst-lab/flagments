import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

interface PluginObj {
  find(object: any, key: string, path: string): string | boolean;
  has(object: any, key: string): string | boolean;
  write(fromObj: any, toObj: any): void;
}

export class Obj implements PluginObj {
  //
  find(object: any, key: string, path: string = ""): string | boolean {
    let found = false;
    for (const k of Object.keys(object)) {
      if (k === key) {
        found = true;
        break;
      }
      if (object[k] && typeof object[k] === "object") {
        return this.find(object[k], key, path + "." + k);
      }
    }
    return found ? path + "." + key : false;
  }

  has(object: any, key: string): string | boolean {
    return typeof object === "object" ? key in object : false;
  }

  write(fromObj: any, toObj: any): void {
    if (Array.isArray(fromObj)) {
      fromObj = JSON.parse(JSON.stringify(toObj));
    } else {
      Object.keys(fromObj).forEach((key) => {
        fromObj[key] = undefined;
      });
      Object.keys(toObj).forEach((key) => {
        fromObj[key] = toObj[key];
      });
    }
  }
}

export default (_ctx: Context, inject: Inject) => {
  inject("obj", new Obj());
};

declare module "@nuxt/types" {
  interface Context {
    $obj: PluginObj;
  }
}
