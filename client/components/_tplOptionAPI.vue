<template>
  <div :class="$style.wrapper"></div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
export default {
  layout: "default",
  middleware(_ctx: Context) {},
  data: () => ({}),
  async beforeMount() {},
  mounted() {},
  methods: {},
};
</script>
<style module>
.wrapper {
  display: block;
}
</style>
