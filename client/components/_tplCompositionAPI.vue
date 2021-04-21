<template>
  <div :class="$style.wrapper"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  watch,
  SetupContext,
} from "@vue/composition-api";
import { MetaInfo } from "vue-meta";
import { Context } from "@nuxt/types";
import { meta } from "@constants";

export default defineComponent({
  middleware(_ctx: Context) {},
  setup(_props: Record<string, any>, { root, refs }: SetupContext) {
    const { $router, $nextTick, $nuxt } = root;
    const { store, route, params, query, env, app } = $nuxt.context;
    const { $obj, $rand, $event, $dayjs, $axios, $scrollTo } = app;
    const vuetify = app.vuetify.framework;
    const vuex = store.getters;

    /**
     * Parameters use in DOM
     */
    const d = {
      loaded: ref(false),
      refs,
    };

    /**
     * Lifecycle Methods
     */
    onBeforeMount(async () => {});

    onMounted(() => {
      loaded();
    });

    watch(d.loaded, () => {
      $event.$emit("loader", !d.loaded.value);
    });
    /**
     * Snippets
     */
    function loaded() {
      setTimeout(() => {
        d.loaded.value = false;
        $nextTick(() => (d.loaded.value = true));
      }, 1000);
    }

    return d;
  },
  head(): MetaInfo {
    const { route, app }: Context = this.$nuxt.context;
    const name = route.name || "index";
    const title = meta.title[name];
    const description = meta.description[name];
    const breadcrumbs = [
      {
        name: meta.title.index,
        link: "/",
      },
      {
        name: meta.title[name],
        link: route.path,
      },
    ];

    setTimeout(() => {
      this.$nuxt.$emit("pageTitle", title);
      this.$nuxt.$emit("breadCrumbs", breadcrumbs);
    }, 100);

    return {
      title,
      script: app.$jsonld(breadcrumbs),
      meta: [
        { hid: "description", name: "description", content: description },
        {
          hid: "keywords",
          name: "keywords",
          content: meta.keywords[name],
        },
        { hid: "og:title", property: "og:title", content: title },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
      ],
    };
  },
});
</script>
<style lang="scss" module>
.wrapper {
  width: 100%;
}
</style>
