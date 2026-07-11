// Shared by the desktop nav (a server component) and MobileNav (client).
// Lives here because a server component can't .map() an array exported from
// a "use client" file.
export const NAV_LINKS: [href: string, label: string][] = [
  ["#how-it-works", "how it works"],
  ["#why", "why"],
  ["#try-it", "examples"],
  ["#faq", "faq"],
];
