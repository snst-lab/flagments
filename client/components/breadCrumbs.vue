<template>
  <nav :class="$style.wrap">
    <ol v-if="loaded">
      <li v-for="(e, i) in list" :key="i">
        <nuxt-link :to="e.link">{{ e.name }}</nuxt-link>
      </li>
    </ol>
    <v-skeleton-loader v-else type="list-item"></v-skeleton-loader>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { BreadCrumb } from "@types";

export default defineComponent({
  setup(_props: Record<string, any>, { root, refs }: SetupContext) {
    const d = {
      loaded: ref(false),
      list: ref([{} as BreadCrumb]),
    };

    root.$on("breadCrumbs", (list: BreadCrumb[]) => {
      d.list.value = list;
      d.loaded.value = true;
    });

    return d;
  },
});
</script>
<style lang="scss" module>
.wrap {
  & ol {
    display: flex;
    padding: 10px 0;
  }
  & li > a {
    color: color("black2");
    font-size: 15px;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
  }
  & li::before {
    content: "/";
    transform: scaleX(2);
    color: color("gray2");
    display: inline-block;
    margin: 0 10px;
  }
  & li:hover > a {
    color: color() !important;
    border-bottom: 1px solid color();
  }
}
</style>
