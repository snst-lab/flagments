<template>
  <v-app id="top">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="false"
      :clipped="false"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(e, i) in items"
          :key="'drawer' + i"
          router
          exact
          @click="e.action()"
        >
          <v-list-item-action>
            <svg viewBox="0,-4,30,30">
              <path :d="$icon[e.icon]" />
            </svg>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="e.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="false" fixed app dense clipped-right>
      <v-btn icon @click.stop="drawer = !drawer">
        <svg viewBox="-12,-12,46,46">
          <path :d="$icon.menu" />
        </svg>
      </v-btn>
      <v-divider class="mx-8" inset vertical />
      <h1 @click="scrollToHash('#top')">
        <v-toolbar-title v-if="loaded">{{ title }}</v-toolbar-title>
        <v-skeleton-loader v-else type="list-item"></v-skeleton-loader>
      </h1>
      <v-spacer />
      <v-btn icon @click.stop="toggleRightDrawer">
        <svg viewBox="-12,-12,46,46">
          <path v-if="rightDrawer" :d="$icon.arrowRight" />
          <path v-else :d="$icon.arrowLeft" />
        </svg>
      </v-btn>
    </v-app-bar>
    <v-main>
      <BreadCrumbs />
      <v-container>
        <Nuxt :nuxt-child-key="$route.fullPath" />
      </v-container>
    </v-main>

    <v-footer fixed>
      <v-bottom-navigation>
        <v-btn @click.stop="drawer = !drawer">
          <p>メニュー</p>
          <svg viewBox="-12,-12,40,40">
            <path :d="$icon.menu" />
          </svg>
        </v-btn>
        <v-divider class="mx-4" inset vertical />

        <v-btn @click.stop="$router.push('/')">
          <p>メニュー</p>
          <svg viewBox="-12,-12,40,40">
            <path :d="$icon.menu" />
          </svg>
        </v-btn>
        <v-divider class="mx-4" inset vertical />

        <v-btn @click.stop="$router.push('/')">
          <p>メニュー</p>
          <svg viewBox="-12,-12,40,40">
            <path :d="$icon.menu" />
          </svg>
        </v-btn>
      </v-bottom-navigation>
    </v-footer>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <Loader />
  </v-app>
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
import { Context } from "@nuxt/types";

export default defineComponent({
  middleware(_ctx: Context) {},
  setup(props: Record<string, any>, { root, refs }: SetupContext) {
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
      title: env.APP_NAME,
      refs,
      update: ref(false),
      drawer: ref(true),
      snackbar: ref(false),
      snackbarText: ref(""),
      rightDrawer: ref(true),
      toggleRightDrawer: () => {
        d.rightDrawer.value = !d.rightDrawer.value;
        root.$emit("rightDrawer", d.rightDrawer.value);
      },
      items: [
        {
          icon: "doc",
          title: "Home",
          action: () => {
            $router.push("/");
          },
        },
        {
          icon: "doc",
          title: "Image tag generator",
          action: () => {
            $router.push("/tag/img");
          },
        },
      ],
      scrollToHash,
      isMobile: vuetify.breakpoint.mdAndDown,
    };
    /**
     * Procedures
     */
    root.$on("pageTitle", (title: string) => {});
    root.$on("snackbar", (text: string) => {
      d.snackbar.value = true;
      d.snackbarText.value = text;
      setTimeout(() => {
        d.snackbar.value = false;
      }, 1000);
    });
    /**
     * Watchers
     */
    watch(d.loaded, () => {
      root.$emit("loader", !d.loaded.value);
    });
    /**
     * Lifecycle methods
     */
    onBeforeMount(() => {
      d.drawer.value = !d.isMobile;
    });

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

    function scrollToHash(hash: string) {
      if (d.isMobile) {
        d.drawer.value = false;
      }
      if (route.path === "/") {
        app.$scrollTo(hash, 500, { offset: 0 });
      } else {
        $router.push({ name: "index", hash });
      }
    }
    return d;
  },
});
</script>
