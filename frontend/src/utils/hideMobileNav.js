const KEY = "ophHideNav";

export function hideMobileNav() {
  if (typeof document === "undefined") return;
  const n = Number(document.body.dataset[KEY] || 0) + 1;
  document.body.dataset[KEY] = String(n);
  document.body.classList.add("oph-hide-mobile-nav");
}

export function showMobileNav() {
  if (typeof document === "undefined") return;
  const n = Math.max(0, Number(document.body.dataset[KEY] || 0) - 1);
  document.body.dataset[KEY] = String(n);
  if (n === 0) document.body.classList.remove("oph-hide-mobile-nav");
}
