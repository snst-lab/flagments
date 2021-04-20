import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

export default (_ctx: Context, inject: Inject) => {
  inject("dayjs", (string: string) => dayjs(string));
};

declare module "@nuxt/types" {
  interface Context {
    $dayjs: Dayjs;
  }
}
