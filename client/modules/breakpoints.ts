import { resolve } from "path";
import { writeFileSync } from "fs";
import { ModuleThis } from "@nuxt/types/config/module";

export default function (this: ModuleThis) {
  const { hook, options } = this.nuxt;

  hook("build:before", async () => {
    const breakPoints = options.vuetify.breakpoint.thresholds;
    const scrollBarWidth = options.vuetify.breakpoint.scrollBarWidth;
    const scss = resolve(
      process.cwd(),
      `${options.rootDir}/assets/css/vuetify/breakpoints.scss`
    );
    console.log("breakPoints:", breakPoints);
    await writeFileSync(
      scss,
      `$grid-breakpoints: (
      'xs': 0,
      'sm': ${breakPoints.xs}px,
      'md': ${breakPoints.sm}px,
      'lg': ${breakPoints.md - scrollBarWidth}px,
      'xl': ${breakPoints.lg - scrollBarWidth}px,
    );
   `,
      { encoding: "utf8" }
    );
  });
}
