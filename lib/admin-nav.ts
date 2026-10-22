/** Az admin menüpontjai (a sorrend a menü sorrendje). */
export const adminNav = [
  { href: "/admin", label: "Áttekintés" },
  { href: "/admin/jelentkezesek", label: "Jelentkezések" },
  { href: "/admin/orarend", label: "Órarend" },
  { href: "/admin/arak", label: "Árak" },
  { href: "/admin/hirek", label: "Hírek" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/rolunk", label: "Rólunk" },
  { href: "/admin/lablec", label: "Lábléc" },
  { href: "/admin/form", label: "Form opciók" },
  { href: "/admin/tajekoztato", label: "Adatkezelés" },
  { href: "/admin/adminok", label: "Adminok" },
] as const;
