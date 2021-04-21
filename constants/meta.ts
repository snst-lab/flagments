interface Meta {
  title: Record<string, string>;
  description: Record<string, string>;
  keywords: Record<string, string>;
  ogp: Record<string, string>;
  noindex: boolean;
}

export const meta: Meta = {
  title: {
    index: "HOME",
    "tag-img": "Image tag generator",
  },
  description: {
    index: "HOME",
    "tag-img": "Image tag generator",
  },
  keywords: {
    index: "HOME",
    "tag-img": "img,tag,generator",
  },
  ogp: {
    index: "",
  },
  noindex: true,
};
