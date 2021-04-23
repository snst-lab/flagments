<template>
  <div :class="$style.wrapper">
    <div>
      <DropArea :on-drop="onDrop" />
      <br />
      <a href="#" @click="clipboard">
        <Markdown
          :key="'markdown' + update"
          :input="markdown"
          :class="$style.markdown"
        />
      </a>
    </div>
    <v-navigation-drawer
      v-model="rightDrawer"
      right
      clipped
      fixed
      app
      width="300"
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Prefix </v-list-item-title>
            <v-text-field v-model="prefix" outlined></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Scale </v-list-item-title>
            <v-select
              v-model="scale"
              :items="Object.keys(scales)"
              outlined
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Options </v-list-item-title>
            <v-checkbox
              v-if="loaded"
              v-model="options_figure"
              label="Wrap with <figure> tag"
            ></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  watch,
  toRef,
  SetupContext,
} from "@vue/composition-api";
import { MetaInfo } from "vue-meta";
import { Context } from "@nuxt/types";
import { meta } from "@constants";

type Scale = {
  x1: number;
  x2: number;
};

export default defineComponent({
  middleware(_ctx: Context) {},
  setup(props: Record<string, any>, { root, refs }: SetupContext) {
    const { $router, $nextTick, $nuxt } = root;
    const { store, app } = $nuxt.context;
    const { $scrollTo, $dayjs, $obj, $rand, $axios } = app;
    const vuetify = app.vuetify.framework;
    const vuex = store.getters;

    /**
     * Parameters use in DOM
     */
    const d = {
      loaded: ref(false),
      refs,
      rightDrawer: ref(true),
      markdown: ref(""),
      tag: ref(""),
      update: ref(true),
      prefix: ref(vuex.get("tag-img_prefix") || "/"),
      scale: ref(vuex.get("tag-img_scale") || "x1"),
      scales: reactive({
        x1: 1,
        x2: 0.5,
      }),
      options_figure: ref(vuex.get("tag-img_options_figure")),
      data: vuex.get("tag-img_data") || {
        name: "",
        size: 0,
        type: "",
        base64: "",
      },
      isMobile: vuetify.breakpoint.mdAndDown,
      onDrop: async (event: any, data: any) => {
        d.data = data;
        await d.drawTag();
        d.save();
      },
      drawTag: (): Promise<void> => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            let basename = d.data.name.replace(/\.[^/.]+$/, "");

            if (d.scale === "x2") {
              basename = basename.replace(/@2x$/, "");
            }

            const prefix = /\/$/.test(d.prefix.value)
              ? d.prefix.value
              : d.prefix.value + "/";
            const scale = d.scales[d.scale.value as keyof Scale];

            if (d.options_figure.value) {
              d.tag.value = `<figure class="img__${basename}">\n  <img src="${prefix}${
                d.data.name
              }" width="${~~(image.naturalWidth * scale)}" height="${~~(
                image.naturalHeight * scale
              )}" alt="${basename}"/>\n</figure>`;
            } else {
              d.tag.value = ` <img class="img__${basename}" src="${prefix}${
                d.data.name
              }" width="${~~(image.naturalWidth * scale)}" height="${~~(
                image.naturalHeight * scale
              )}" alt="${basename}"/>`;
            }

            d.markdown.value = "```html\n" + d.tag.value + "\n```";
            resolve();
          };
          image.src = d.data.base64;
        });
      },
      clipboard: () => {
        if (navigator) {
          navigator.clipboard.writeText(d.tag.value);
          root.$emit("snackbar", "Copied!");
        } else {
          root.$emit("snackbar", "Current browser dose not support clipboard");
        }
      },
      save: () => {
        vuex.set("tag-img_prefix", d.prefix.value);
        vuex.set("tag-img_scale", d.scale.value);
        vuex.set("tag-img_options_figure", d.options_figure.value);
        vuex.set("tag-img_data", d.data);
      },
    };
    /**
     * Watchers
     */
    watch(d.markdown, () => {
      d.update.value = !d.update.value;
    });
    watch([d.prefix, d.scale, d.options_figure], async () => {
      await d.drawTag();
      d.save();
    });
    /**
     * Lifecycle Methods
     */
    onBeforeMount(() => {
      d.rightDrawer.value = !d.isMobile;
      root.$on("rightDrawer", (open: boolean) => {
        d.rightDrawer.value = open;
      });
    });

    onMounted(() => {
      d.drawTag();
      loaded();
    });

    /**
     * Snippets
     */
    function loaded() {
      setTimeout(() => {
        d.loaded.value = false;
        $nextTick(() => (d.loaded.value = true));
      }, 500);
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

.markdown {
  background: color("black1");

  pre {
    background: inherit;
  }
}
</style>
