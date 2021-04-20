import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

export interface BreadCrumbItem {
  link: string;
  name: string;
}

export interface JSONLD {
  type: string;
  json: {
    "@context": string;
    "@type": string;
    itemListElement: {
      "@type": string;
      position: number;
      item: {
        "@id": string;
        name: string;
      };
    }[];
  };
}

export function jsonld(breadcrumbs: BreadCrumbItem[]): JSONLD[] {
  const items = breadcrumbs.map((item: BreadCrumbItem, index: number) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@id": item.link,
      name: item.name,
    },
  }));

  return [
    {
      type: "application/ld+json",
      json: {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
      },
    },
  ];
}

export default (_ctx: Context, inject: Inject) => {
  inject("jsonld", jsonld);
};
