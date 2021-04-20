<template>
  <div class="markdown-body" :class="$style.markdown" v-html="srcText" />
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import hljs from "highlight.js";

const marked = require("marked");

export default defineComponent({
  props: {
    input: {
      type: String,
      default: "",
      required: false,
    },
  },
  setup(props: Record<string, any>, { root, refs }: SetupContext) {
    marked.setOptions({
      langPrefix: "",
      highlight(code: string, lang: string) {
        return hljs.highlightAuto(code, [lang]).value;
      },
    });
    /**
     * Parameters use in DOM
     */
    return {
      srcText: ref(marked(props.input)),
    };
  },
});
</script>

<style lang="scss" module>
.markdown {
  min-height: 80px;
  width: 100%;
  border-radius: 10px;
  padding: 1em;
}
</style>
