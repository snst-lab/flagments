import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import {
  mdiMenu,
  mdiMenuLeftOutline,
  mdiMenuRightOutline,
  mdiChevronUp,
  mdiFolder,
  mdiFolderOpen,
  mdiFileDocumentOutline,
  mdiCloudUploadOutline,
} from "@mdi/js";

export default (_ctx: Context, inject: Inject) => {
  inject("icon", {
    menu: mdiMenu,
    arrowLeft: mdiMenuLeftOutline,
    arrowRight: mdiMenuRightOutline,
    arrowUp: mdiChevronUp,
    folder: mdiFolder,
    folderOpen: mdiFolderOpen,
    doc: mdiFileDocumentOutline,
    upload: mdiCloudUploadOutline,
  });
};
