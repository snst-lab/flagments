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
      prefix: ref(""),
      scale: ref("x1"),
      scales: reactive({
        x1: 1,
        x2: 0.5,
      }),
      data: {
        name: "",
        size: 0,
        type: "",
        base64: "",
      },
      isMobile: vuetify.breakpoint.mdAndDown,
      scaleChange: () => {},
      onDrop: (event: DragEvent, data: any) => {
        d.data = data;
        d.drawTag();
      },
      drawTag: () => {
        const image = new Image();
        image.onload = () => {
          const basename = d.data.name.replace(/\.[^/.]+$/, "");
          const prefix = /\/$/.test(d.prefix.value)
            ? d.prefix.value
            : d.prefix.value + "/";
          const scale = d.scales[d.scale.value as keyof Scale];

          d.tag.value = `<img src="${prefix}${d.data.name}" width="${~~(
            image.naturalWidth * scale
          )}" height="${~~(image.naturalHeight * scale)}" alt="${basename}"/>`;

          d.markdown.value = "```html\n" + d.tag.value + "\n```";
        };
        image.src = d.data.base64;
      },
      clipboard: () => {
        if (navigator) {
          navigator.clipboard.writeText(d.tag.value);
          root.$emit("snackbar", "Copied!");
        } else {
          root.$emit("snackbar", "Current browser dose not support clipboard");
        }
      },
    };

    /**
     * Watchers
     */
    watch(d.markdown, () => {
      d.update.value = !d.update.value;
    });
    watch([d.prefix, d.scale], () => {
      d.drawTag();
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
      {
        name: meta.title[name],
        link: meta.link[name],
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
