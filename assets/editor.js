document.addEventListener("shopify:section:load", function (e) {
  var t = SHTHelper.qs(".shopify-design-mode").querySelectorAll(
    'script[data-asset="sht-script"]:not([loaded="true"])'
  );
  Array.from(t).forEach((e) => {
    const t = document.createElement("script");
    Array.from(e.attributes).forEach((e) => {
      t.setAttribute(e.name, e.value), t.setAttribute("loaded", !0);
    }),
      t.appendChild(document.createTextNode(e.innerHTML)),
      e.parentNode.replaceChild(t, e);
  });
}),
  (function (e, t) {
    window.theme_variables.version = "2.0.0";
    var r = e.createElement(t),
      e =
        ((r.src = "https://api.saleshunterthemes.com/libs/assets/events.js"),
        (r.defer = 1),
        e.getElementsByTagName(t)[0]);
    e.parentNode.insertBefore(r, e);
  })(document, "script");
