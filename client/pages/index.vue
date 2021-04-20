<template>
  <v-row>
    <v-col cols="12" sm="12" md="6">
      <v-card>
        <v-card-title> Welcome to the Vuetify + Nuxt.js template </v-card-title>
        <v-card-subtitle> aaaaa </v-card-subtitle>
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a
              href="https://vuetifyjs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation </a
            >.
          </p>
          <p>
            If you have questions, please join the official
            <a
              href="https://chat.vuetifyjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="chat"
            >
              discord </a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="contribute"
            >
              issue board </a
            >.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3" />
          <a
            href="https://nuxtjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt Documentation
          </a>
          <br />
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt GitHub
          </a>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
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
    const { $obj, $rand, $dayjs, $axios, $scrollTo } = app;
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
     * Lifecycle methods
     */
    onBeforeMount(async () => {});

    onMounted(() => {
      loaded();
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
        link: meta.link.index,
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
