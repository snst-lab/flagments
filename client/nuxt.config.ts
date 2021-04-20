import path from "path";
import dotenv from "dotenv";
import { NuxtConfig, Configuration } from "@nuxt/types";
import { NuxtOptionsEnv } from "@nuxt/types/config/env";
import { NuxtOptionsLoaders } from "@nuxt/types/config/build";
import { url, meta, color } from "../constants";

dotenv.config({
  path: path.resolve(process.cwd(), `.env`),
});

export const config: NuxtConfig = {
  env: process.env as NuxtOptionsEnv,
  rootDir: "client",
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      prefix: "og: http://ogp.me/ns#",
      lang: "ja",
    },
    title: meta.title.index,
    meta: [
      {
        hid: "robots",
        name: "robots",
        content: meta.noindex ? "noindex" : "index",
      },
      { "http-equiv": "x-ua-compatible", content: "ie=edge", property: "" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "format-detection",
        content: "telephone=no, email=no, address=no",
      },
      {
        hid: "description",
        name: "description",
        content: meta.description.index,
      },
      { hid: "keywords", name: "keywords", content: meta.keywords.index },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "" + process.env.APP_NAME,
      },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: url.client,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: meta.title.index,
      },
      {
        hid: "og:description",
        property: "og:description",
        content: meta.description.index,
      },
      { hid: "og:image", property: "og:image", content: meta.ogp.index },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    link: [
      { hid: "canonical", rel: "canonical", href: url.client },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preload",
        as: "font",
        href: "/font/NotoSansCJKjp-Regular.min.woff2",
        crossorigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        href: "/font/NotoSansCJKjp-Bold.min.woff2",
        crossorigin: "anonymous",
      },
    ],
    script: [
      {
        src: "https://polyfill.io/v3/polyfill.min.js?features=default",
        body: false,
      },
    ],
    __dangerouslyDisableSanitizers: ["title", "meta"],
  },

  // Google Tag Manger: https://github.com/nuxt-community/gtm-module
  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID,
    enabled: true,
  },
  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      enabled: true,
    },
  },

  alias: {
    "@types": path.resolve(process.cwd(), "@types/index"),
    "@constants": path.resolve(process.cwd(), "constants/index"),
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "@/plugins/object", ssr: true },
    { src: "@/plugins/random", ssr: true },
    { src: "@/plugins/routerOption", ssr: true },
    { src: "@/plugins/compositionApi", ssr: true },
    { src: "@/plugins/dayjs", ssr: true },
    { src: "@/plugins/jsonld", ssr: true },
    { src: "@/plugins/nuxtClientInit", ssr: false },
    { src: "@/plugins/userAgent", ssr: true },
    { src: "@/plugins/scrollTo", ssr: false },
    { src: "@/plugins/lazyload", ssr: false },
    { src: "@/plugins/icon", ssr: true },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: ["@/components"],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    // https://github.com/nuxt-community/style-resources-module
    "@nuxtjs/style-resources",
    // custom modules
    "@/modules/breakpoints",
    "@/modules/color",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    // https://github.com/nuxt-community/amp-module
    "@nuxtjs/amp",
    // https://github.com/nuxt-community/gtm-module
    "@nuxtjs/gtm",
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    extend(
      config: Configuration,
      _ctx: { loaders: NuxtOptionsLoaders } | NuxtOptionsLoaders
    ) {
      config.performance = config.performance || {};
      config.performance.maxEntrypointSize = 100 * 1024;
      config.performance.maxAssetSize = 100 * 1024;
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      fileName: "icon.png",
    },
    manifest: {
      name: process.env.APP_NAME,
      lang: "ja",
      short_name: process.env.APP_NAME,
      title: meta.title.index,
      "og:title": meta.title.index,
      description: meta.description.index,
      "og:description": meta.description.index,
      theme_color: color.key,
      background_color: color.bg,
    },
    workbox: {
      dev: false, // enable pwa on development mode
      runtimeCaching: [
        {
          urlPattern: "https://polyfill.io/.*",
          handler: "cacheFirst",
        },
        {
          urlPattern: "https://cdn.jsdelivr.net/.*",
          handler: "cacheFirst",
        },
        {
          urlPattern: "^https://fonts.(?:googleapis|gstatic).com/(.*)",
          handler: "cacheFirst",
        },
        {
          urlPattern: "/font/.*",
          handler: "cacheFirst",
        },
        {
          urlPattern: "/.*",
          handler: "staleWhileRevalidate",
          strategyOptions: {
            cacheName: "local-cache",
            cacheExpiration: {
              maxAgeSeconds: 24 * 60 * 60 * 30,
            },
          },
        },
      ],
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/global/index"],

  // styleResources: https://github.com/nuxt-community/style-resources-module
  // Place only variables or mixin. Don't place files include CSS description!
  styleResources: {
    scss: ["@/assets/css/resource/*.scss"],
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: [
      "@/assets/css/vuetify/breakpoints.scss",
      "@/assets/css/vuetify/variables.scss",
    ],
    defaultAssets: {
      font: false,
      icons: "mdiSvg",
    },
    theme: {
      options: {
        cspNonce: Math.random().toString(32).substring(2),
        variations: false,
        minifyTheme: (css: string) => css.replace(/\n/g, ""),
      },
    },
    breakpoint: {
      thresholds: {
        xs: 340,
        sm: 640,
        md: 800,
        lg: 1280,
      },
      scrollBarWidth: 16,
    },
  },

  // Server middleware :   https://ja.nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware/
  // Only SSR mode. use for API proxy etc.
  serverMiddleware: [],
};

export default config;
