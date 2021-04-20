import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import Vue from "vue";
import VueScrollTo, { ScrollOptions } from "vue-scrollto";

type ElementDescriptor = Element | string;

type ScrollToFunction = {
  (options: ScrollOptions): () => void;
  (element: ElementDescriptor, options?: ScrollOptions): () => void;
  (
    element: ElementDescriptor,
    duration: number,
    options?: ScrollOptions
  ): () => void;
};

Vue.use(VueScrollTo, {
  duration: 700,
  easing: [0, 0, 0.1, 1],
  offset: -100,
});

export default (_ctx: Context, inject: Inject) => {
  inject("scrollTo", VueScrollTo.scrollTo);
};

declare module "@nuxt/types" {
  interface Context {
    $scrollTo: ScrollToFunction;
  }
}
