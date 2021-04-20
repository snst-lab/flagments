import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { ModuleThis } from "@nuxt/types/config/module";

export default function (this: ModuleThis) {
  const { hook, options } = this.nuxt;

  hook("build:before", async () => {
    const input = await import(`../../constants/color`);
    const output = resolve(
      process.cwd(),
      `${options.rootDir}/assets/css/resource/color.scss`
    );
    let cssString = "";
    Object.keys(input.color).forEach((e: string) => {
      cssString += `${e}: ${input.color[e]},\n`;
    });
    await writeFileSync(
      output,
      `$color-list: (\n${cssString});
      @function color($type:"key"){
        @return map-get($color-list,$type);
      }
   `,
      { encoding: "utf8" }
    );
  });
}
