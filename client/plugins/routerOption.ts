import { Context } from "@nuxt/types";

export default (ctx: Context) => {
  const router = ctx.store.$router;
  const root = ctx.store.app.parent;
  router.beforeEach((to, from, next) => {
    root?.$emit("loader", true);
    next();
  });
  router.afterEach((to, from) => {
    root?.$emit("loader", false);
  });
};
