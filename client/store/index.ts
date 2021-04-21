import { NuxtState } from "@nuxt/types/app";
import { Store } from "vuex";
import cookie from "js-cookie";

export const state = () => {};

export const mutations = {
  set(
    state: NuxtState,
    { key, value, expire }: { key: string; value: any; expire: number }
  ) {
    switch (typeof value) {
      case "object":
        state[key] = JSON.stringify(value);
        break;
      default:
        state[key] = value;
    }
    if (
      typeof expire === "undefined" ||
      (typeof expire !== "undefined" && expire > 0)
    ) {
      localStorage.setItem("store", JSON.stringify(state));
      cookie.set("store_" + key, "true", { expires: expire || 1 });
    }
  },
  restore(state: NuxtState, storage: Record<string, any>) {
    Object.keys(storage).forEach((key) => {
      if (cookie.get("store_" + key)) {
        state[key] = storage[key];
      }
    });
    localStorage.setItem("store", JSON.stringify(state));
  },
};

export const actions = {
  /**
   * Only SSR
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nuxtServerInit({ state, commit, dispatch }: Store<any>) {},

  /**
   * SSR/SPA/SSG Common
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nuxtClientInit({ state, commit, dispatch }: Store<any>) {
    const storage = localStorage.getItem("store");
    if (typeof storage === "string") {
      commit("restore", JSON.parse(storage));
    }
  },
};

export const getters = {
  set: (state: NuxtState) => (key: string, value: any, expire: number) => {
    mutations.set(state, { key, value, expire });
  },
  get: (state: NuxtState) => (key: string) => {
    if (typeof key !== "string" || !(key in state)) {
      return null;
    }
    try {
      return JSON.parse(state[key]);
    } catch (e) {
      return String(state[key]);
    }
  },
  exist: (state: NuxtState) => (key: string) => {
    return key in state;
  },
};
