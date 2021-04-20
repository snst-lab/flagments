<template>
  <div :class="$style.wrapper">
    <div
      :class="[$style.dropArea, , `${dragging ? $style.dragEnter : ''}`]"
      @dragover.stop.prevent
      @dragenter.stop.prevent="on.dragEnter"
      @mouseenter.stop.prevent="on.dragEnter"
      @dragleave.prevent="on.dragLeave"
      @mouseleave.prevent="on.dragLeave"
      @drop.stop.prevent="on.drop"
      @click="on.click"
    >
      <div v-if="$agent.pc">
        <svg viewBox="-8,-8,36,36">
          <path :d="$icon.upload" />
        </svg>
        <span> {{ textPc }} </span>
      </div>
      <div v-else>
        <svg viewBox="-8,-8,36,36">
          <path :d="$icon.upload" />
        </svg>
        <span> {{ textSp }} </span>
      </div>
    </div>
    <input
      ref="input"
      type="file"
      :accept="accept"
      style="display: none"
      @change="on.changeFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";

export default defineComponent({
  props: {
    accept: {
      type: String,
      default: "*",
      required: false,
    },
    textPc: {
      type: String,
      default: "Drop file here",
      required: false,
    },
    textSp: {
      type: String,
      default: "Click here to choose file",
      required: false,
    },
    onDrop: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  setup(props: Record<string, any>, { root, refs }: SetupContext) {
    /**
     * Parameters use in DOM
     */
    const d = {
      dragging: ref(false),
      on: {
        dragEnter: (event: any) => {
          d.dragging.value = true;
        },
        dragLeave: (event: any) => {
          d.dragging.value = false;
        },
        drop: (event: any) => {
          d.dragging.value = false;
          const files = event.target?.files
            ? event.target?.files
            : event.dataTransfer?.files;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const data = {
              name: files[0].name,
              size: files[0].size,
              type: files[0].type,
              base64: e.target?.result,
            };
            props.onDrop(event, data);
          };
          if (files[0]) {
            reader.readAsDataURL(files[0]);
          }
        },
        click: (event: PointerEvent) => {
          (refs.input as HTMLInputElement).click();
        },
        changeFile: (event: any) => {
          d.on.drop(event);
        },
      },
    };

    return d;
  },
});
</script>
<style lang="scss" module>
.wrapper {
  width: 100%;
}

.dropArea {
  cursor: pointer;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 5px dashed color("gray1");
  border-radius: 20px;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  transition: 0.2s;
  svg {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    width: 50px;
    height: 50px;
  }

  svg > path {
    fill: color("black2");
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
  @include sp() {
    height: 200px;
  }
  &.dragEnter {
    border: 5px dashed color();
    background-color: color("gray2");
    span {
      color: color();
    }
    svg > path {
      fill: color();
    }
  }
}
</style>
